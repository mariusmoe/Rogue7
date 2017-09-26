
export interface Modal {
  headerText: string;
  bodyText: string;

  proceedColor: string;
  proceedText: string;

  cancelColor?: string;
  cancelText?: string;
  includeCancel: boolean;

  proceed(): void;
  cancel?(): void;
}
