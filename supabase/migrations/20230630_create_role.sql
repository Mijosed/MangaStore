-- Create the updated_at column update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the role enum type
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create the role table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX roles_user_id_idx ON roles(user_id);
CREATE INDEX roles_role_idx ON roles(role);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies

-- Allow users to read their own role
CREATE POLICY "Users can read their own role"
    ON roles FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to read all roles
CREATE POLICY "Admins can read all roles"
    ON roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow admins to insert roles
CREATE POLICY "Admins can insert roles"
    ON roles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow admins to update roles
CREATE POLICY "Admins can update roles"
    ON roles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Allow admins to delete roles
CREATE POLICY "Admins can delete roles"
    ON roles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Insert the first admin (replace 'your-admin-user-id' with the actual UUID)
-- INSERT INTO roles (user_id, role) VALUES ('your-admin-user-id', 'admin');

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM roles
        WHERE roles.user_id = $1
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM roles
        WHERE roles.user_id = $1
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE roles IS 'Table storing user roles for the application';
COMMENT ON COLUMN roles.id IS 'Unique identifier for the role entry';
COMMENT ON COLUMN roles.user_id IS 'Reference to the auth.users table';
COMMENT ON COLUMN roles.role IS 'The role assigned to the user (admin or user)';
COMMENT ON COLUMN roles.created_at IS 'Timestamp when the role was created';
COMMENT ON COLUMN roles.updated_at IS 'Timestamp when the role was last updated';
