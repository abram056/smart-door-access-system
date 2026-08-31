// Matches docs/05_Message_Contracts.md — Standard Error Format
// Every error response across every endpoint uses exactly this shape.
// There is no `success`/`data` envelope anywhere in the contracts — success
// responses are the raw contract shape (e.g. LoginResponse), returned directly.

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
