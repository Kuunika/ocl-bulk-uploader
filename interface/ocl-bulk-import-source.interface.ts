export interface IOclBulkImportSource {
  type: string;
  id: string;
  short_code: string;
  name: string;
  full_name: string;
  owner: string;
  owner_type: string;
  description: string;
  source_type: string;
  public_access: string;
  default_locale: string;
  supported_locales: string;
  custom_validation_schema: string;
}
