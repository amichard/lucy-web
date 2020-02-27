-- ### Creating Table: previous_inspection_source ### --

        
CREATE TABLE previous_inspection_source ();
ALTER TABLE previous_inspection_source ADD COLUMN previous_inspection_source_id SERIAL PRIMARY KEY;
ALTER TABLE previous_inspection_source ADD COLUMN description VARCHAR(50) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE previous_inspection_source IS 'Code table with options for sources of previous invasive mussel inspections';
COMMENT ON COLUMN previous_inspection_source.previous_inspection_source_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN previous_inspection_source.description IS 'Brief description of the source of the previous inspection(s)';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE previous_inspection_source ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE previous_inspection_source ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN previous_inspection_source.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN previous_inspection_source.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE previous_inspection_source ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE previous_inspection_source ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN previous_inspection_source.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN previous_inspection_source.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: previous_inspection_source ### --