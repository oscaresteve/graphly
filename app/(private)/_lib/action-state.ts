export type ActionState<TField extends string> = {
  success: boolean;
  fieldErrors: Partial<Record<TField, string[]>>;
  formError: string | null;
  redirectTo?: string,
};

export function createInitialActionState<
  TField extends string,
>(): ActionState<TField> {
  return {
    success: false,
    fieldErrors: {},
    formError: null,
  };
}

export type FormValidationResult<TData, TField extends string> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      fieldErrors: ActionState<TField>["fieldErrors"];
    };
