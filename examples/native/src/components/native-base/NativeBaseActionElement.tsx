import type { ActionNativeProps } from '@react-querybuilder/native';
import { Button } from 'native-base';

export const NativeBaseActionElement = ({
  handleOnClick,
  label,
  disabled,
  disabledTranslation,
  title,
}: ActionNativeProps) => (
  <Button
    aria-label={title}
    disabled={disabled && !disabledTranslation}
    onPress={(e: any) => handleOnClick(e)}>
    {disabledTranslation && disabled
      ? disabledTranslation.label ?? ''
      : label ?? ''}
  </Button>
);

NativeBaseActionElement.displayName = 'NativeBaseActionElement';
