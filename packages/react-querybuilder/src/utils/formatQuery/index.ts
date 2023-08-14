import type { ValueProcessorLegacy } from '../../types/index.noReact';
import { defaultRuleProcessorCEL } from './defaultRuleProcessorCEL';
import { defaultRuleProcessorMongoDB } from './defaultRuleProcessorMongoDB';
import { defaultRuleProcessorSpEL } from './defaultRuleProcessorSpEL';
import { defaultValueProcessorByRule } from './defaultValueProcessorByRule';

const internalValueProcessors = {
  default: defaultValueProcessorByRule,
  mongodb: defaultRuleProcessorMongoDB,
  cel: defaultRuleProcessorCEL,
  spel: defaultRuleProcessorSpEL,
} as const;

const generateValueProcessor =
  (format: 'default' | 'mongodb' | 'cel' | 'spel'): ValueProcessorLegacy =>
  (field, operator, value, valueSource) =>
    internalValueProcessors[format](
      { field, operator, value, valueSource },
      { parseNumbers: false }
    );
// TODO: deprecate this
export const defaultValueProcessor = generateValueProcessor('default');
/**
 * @deprecated Prefer `defaultRuleProcessorMongoDB`.
 */
export const defaultMongoDBValueProcessor = generateValueProcessor('mongodb');
/**
 * @deprecated Prefer `defaultRuleProcessorCEL`.
 */
export const defaultCELValueProcessor = generateValueProcessor('cel');
/**
 * @deprecated Prefer `defaultRuleProcessorSpEL`.
 */
export const defaultSpELValueProcessor = generateValueProcessor('spel');

export { defaultRuleProcessorJsonLogic } from './defaultRuleProcessorJsonLogic';
export { defaultRuleProcessorSQL } from './defaultRuleProcessorSQL';
export * from './formatQuery';
export { jsonLogicAdditionalOperators } from './utils';
export { defaultValueProcessorByRule };
export { defaultRuleProcessorCEL };
export { defaultRuleProcessorMongoDB };
export { defaultRuleProcessorSpEL };
/**
 * @deprecated Renamed to "defaultRuleProcessorCEL".
 */
export const defaultValueProcessorCELByRule = defaultRuleProcessorCEL;
/**
 * @deprecated Renamed to "defaultRuleProcessorMongoDB".
 */
export const defaultValueProcessorMongoDBByRule = defaultRuleProcessorMongoDB;
/**
 * @deprecated Renamed to "defaultRuleProcessorSpEL".
 */
export const defaultValueProcessorSpELByRule = defaultRuleProcessorSpEL;
