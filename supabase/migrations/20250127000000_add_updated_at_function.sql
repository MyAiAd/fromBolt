/*
  # Add updated_at trigger function
  
  This migration adds the update_updated_at_column function that is used
  by triggers to automatically update updated_at timestamps.
*/

-- Create the function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 