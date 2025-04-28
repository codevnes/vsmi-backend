# Tasks

## Completed Tasks

- [x] Fix price import issue with European decimal format (comma as decimal separator)
  - Fixed in fileProcessor.service.ts by adding a parseNumber function that handles both dot and comma decimal separators
  - Added improved error handling and validation for CSV and XLSX processing
  - Added a test script (src/scripts/testPriceImport.ts) to verify the fix
- [x] Implement ROA/ROE Records API
  - Created roaRoe.routes.ts with all CRUD endpoints and import functionality
  - Created roaRoe.controller.ts with validation and request handling
  - Created roaRoe.service.ts for business logic implementation
  - Added endpoints for retrieving, creating, updating, and deleting ROA/ROE records
  - Implemented bulk import and file import functionality
  - Added comprehensive Vietnamese API documentation in docs/api/roa-roe-api-vi.md
- [x] Update PE Records API
  - Enhanced pe.service.ts with improved data handling and validation
  - Updated pe.controller.ts with better error handling and file processing
  - Added helper functions for parsing numbers with European decimal format
  - Created Vietnamese API documentation in docs/api/pe-records-vi.md
  - Improved file import functionality for CSV and Excel
- [x] Implement Settings API
  - Created setting.service.ts with CRUD operations and utility functions
  - Created setting.controller.ts with validation and error handling
  - Created setting.routes.ts with protected endpoints
  - Implemented type validation for different setting types (text, number, boolean, json, image)
  - Added group-based settings retrieval
  - Created comprehensive Vietnamese API documentation in docs/api-setting.md
  - Added bulk operations for efficient settings management
- [x] Add API for importing currencies and currency prices
  - Updated currency.service.ts with file processing functions for CSV and XLSX files
  - Added support for both dot and comma decimal separators
  - Added importCurrencies and importCurrencyPrices functions
  - Updated currency.controller.ts with importCurrenciesFromFile, importCurrencyPricesFromFile, importCurrenciesFromJson, and importCurrencyPricesFromJson
  - Added file upload configuration using multer
  - Updated currency.routes.ts with new import endpoints
  - Created comprehensive Vietnamese API documentation in docs/api/currency-import-vi.md
  - Added import functionality references to docs/api-currency.md and docs/api-currency-prices.md

## Pending Tasks 