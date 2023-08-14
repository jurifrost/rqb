import type {
  JsonLogicVar,
  RQBJsonLogic,
  RuleProcessor,
  RuleType,
} from '../../types/index.noReact';
import { toArray } from '../arrayUtils';
import { isValidValue, shouldRenderAsNumber } from './utils';

const convertOperator = (op: '<' | '<=' | '=' | '!=' | '>' | '>=') =>
  op
    .replace(/^(=)$/, '$1=')
    .replace(/^notNull$/i, '!=')
    .replace(/^null$/i, '==') as '<' | '<=' | '==' | '!=' | '===' | '!==' | '>' | '>=';

const negateIfNotOp = (op: string, jsonRule: RQBJsonLogic) =>
  /^(does)?not/i.test(op) ? { '!': jsonRule } : jsonRule;

export const defaultRuleProcessorJsonLogic: RuleProcessor = (
  { field, operator, value, valueSource }: RuleType,
  { parseNumbers } = {}
): RQBJsonLogic => {
  const valueIsField = valueSource === 'field';
  const fieldObject: JsonLogicVar = { var: field };
  const fieldOrNumberRenderer = (v: any) =>
    valueIsField ? { var: `${v}` } : shouldRenderAsNumber(v, parseNumbers) ? parseFloat(v) : v;

  switch (operator) {
    case '<':
    case '<=':
    case '=':
    case '!=':
    case '>':
    case '>=':
      return {
        [convertOperator(operator)]: [fieldObject, fieldOrNumberRenderer(value)],
      } as RQBJsonLogic;

    case 'null':
    case 'notNull': {
      return {
        [`${operator === 'notNull' ? '!' : '='}=`]: [fieldObject, null],
      } as RQBJsonLogic;
    }

    case 'in':
    case 'notIn': {
      // TODO: extract this map function
      const valueAsArray = toArray(value).map(fieldOrNumberRenderer);
      if (valueAsArray.length > 0) {
        const jsonRule: RQBJsonLogic = { in: [fieldObject, valueAsArray] };
        return negateIfNotOp(operator, jsonRule);
      }
      return false;
    }

    case 'between':
    case 'notBetween': {
      const valueAsArray = toArray(value);
      if (
        valueAsArray.length >= 2 &&
        isValidValue(valueAsArray[0]) &&
        isValidValue(valueAsArray[1])
      ) {
        let [first, second] = valueAsArray;
        if (
          !valueIsField &&
          shouldRenderAsNumber(first, true) &&
          shouldRenderAsNumber(second, true)
        ) {
          const firstNum = parseFloat(first);
          const secondNum = parseFloat(second);
          if (secondNum < firstNum) {
            const tempNum = secondNum;
            second = firstNum;
            first = tempNum;
          } else {
            first = firstNum;
            second = secondNum;
          }
        } else if (valueIsField) {
          first = { var: first };
          second = { var: second };
        }
        const jsonRule: RQBJsonLogic = { '<=': [first, fieldObject, second] };
        return negateIfNotOp(operator, jsonRule);
      }
      return false;
    }

    case 'contains':
    case 'doesNotContain': {
      const jsonRule: RQBJsonLogic = {
        in: [fieldOrNumberRenderer(value), fieldObject],
      };
      return negateIfNotOp(operator, jsonRule);
    }

    case 'beginsWith':
    case 'doesNotBeginWith': {
      const jsonRule: RQBJsonLogic = {
        startsWith: [fieldObject, fieldOrNumberRenderer(value)],
      };
      return negateIfNotOp(operator, jsonRule);
    }

    case 'endsWith':
    case 'doesNotEndWith': {
      const jsonRule: RQBJsonLogic = {
        endsWith: [fieldObject, fieldOrNumberRenderer(value)],
      };
      return negateIfNotOp(operator, jsonRule);
    }
  }
  return false;
};
