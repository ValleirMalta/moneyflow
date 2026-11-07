-- ==========================================
-- 1. EXTENSÕES & ENUMS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'investment', 'credit', 'cash');
CREATE TYPE recurrence_type AS ENUM ('fixed', 'installment');

-- ==========================================
-- 2. TABELAS BASE
-- ==========================================

-- Profiles (Vinculado ao auth.users do Supabase)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Categories (Classificação de receitas e despesas)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Accounts (Multi-carteira com precisão financeira NUMERIC)
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type account_type NOT NULL DEFAULT 'checking',
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Recurring Incomes (Rendas Fixas / Recorrentes)
CREATE TABLE public.recurring_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  day_of_month INT NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
  competence_start_date DATE NOT NULL,
  competence_end_date DATE,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Recurring Expenses (Custos Fixos e Parcelamentos)
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  day_of_month INT NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
  recurrence_type recurrence_type NOT NULL DEFAULT 'fixed',
  total_installments INT CHECK (total_installments > 1),
  competence_start_date DATE NOT NULL,
  competence_end_date DATE,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Transactions (O Histórico Real de Movimentações)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  recurring_income_id UUID REFERENCES public.recurring_incomes(id) ON DELETE SET NULL,
  recurring_expense_id UUID REFERENCES public.recurring_expenses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type transaction_type NOT NULL,
  date DATE NOT NULL,
  installment_number INT,
  total_installments INT,
  is_paid BOOLEAN DEFAULT FALSE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 3. ÍNDICES DE PERFORMANCE
-- ==========================================
CREATE INDEX idx_categories_user ON public.categories(user_id);
CREATE INDEX idx_accounts_user ON public.accounts(user_id);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX idx_transactions_account ON public.transactions(account_id);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) - BLINDAGEM DE DADOS
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas estritas de acesso restrito ao próprio utilizador autenticado
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own categories" ON public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own recurring_incomes" ON public.recurring_incomes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own recurring_expenses" ON public.recurring_expenses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. TRIGGERS AUTOMÁTICOS
-- ==========================================

-- Trigger para criar perfil automaticamente ao registar utilizador no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar o saldo da conta com base nas transações de forma segura
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.type = 'income' THEN
      UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id AND user_id = NEW.user_id;
    ELSE
      UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id AND user_id = NEW.user_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.type = 'income' THEN
      UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id AND user_id = OLD.user_id;
    ELSE
      UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id AND user_id = OLD.user_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.type = 'income' THEN
      UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id AND user_id = OLD.user_id;
    ELSE
      UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id AND user_id = OLD.user_id;
    END IF;
    
    IF NEW.type = 'income' THEN
      UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id AND user_id = NEW.user_id;
    ELSE
      UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id AND user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_update_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_account_balance();

-- ==========================================
-- 6. FUNÇÃO RPC BLINDADA PARA PARCELAMENTOS
-- ==========================================
-- Valida se a conta e categoria pertencem obrigatoriamente ao utilizador autenticado
-- antes de permitir qualquer inserção em massa (Prevenção contra IDOR / Hack injection)
CREATE OR REPLACE FUNCTION public.create_installment_expense(
  p_name TEXT,
  p_total_amount NUMERIC(12, 2),
  p_total_installments INT,
  p_current_installment INT,
  p_current_month_date DATE,
  p_account_id UUID,
  p_category_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_installment_amount NUMERIC(12, 2);
  v_start_date DATE;
  v_rec_expense_id UUID;
  i INT;
  v_tx_date DATE;
BEGIN
  -- BLINDAGEM: Valida se a conta pertence ao utilizador atual
  IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE id = p_account_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: Conta inválida ou não pertence ao utilizador.';
  END IF;

  -- BLINDAGEM: Valida se a categoria pertence ao utilizador atual
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE id = p_category_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: Categoria inválida ou não pertence ao utilizador.';
  END IF;

  v_installment_amount := ROUND(p_total_amount / p_total_installments, 2);
  v_start_date := p_current_month_date - ((p_current_installment - 1) || ' month')::INTERVAL;

  -- Insere a regra-mãe na tabela de despesas recorrentes
  INSERT INTO public.recurring_expenses (
    user_id, account_id, category_id, name, amount, day_of_month,
    recurrence_type, total_installments, competence_start_date
  ) VALUES (
    v_user_id, p_account_id, p_category_id, p_name, v_installment_amount,
    EXTRACT(DAY FROM p_current_month_date)::INT, 'installment', p_total_installments, v_start_date
  ) RETURNING id INTO v_rec_expense_id;

  -- Gera todas as parcelas na tabela de transações com validação estrita de user_id
  FOR i IN 1..p_total_installments LOOP
    v_tx_date := v_start_date + ((i - 1) || ' month')::INTERVAL;
    
    INSERT INTO public.transactions (
      user_id, account_id, category_id, recurring_expense_id,
      name, amount, type, date, installment_number, total_installments, is_paid
    ) VALUES (
      v_user_id, p_account_id, p_category_id, v_rec_expense_id,
      p_name || ' (' || i || '/' || p_total_installments || ')',
      v_installment_amount, 'expense', v_tx_date, i, p_total_installments,
      (v_tx_date <= CURRENT_DATE)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;