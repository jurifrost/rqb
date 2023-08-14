// WARNING: if the exports in this file change, ../index.noReact.ts must be updated

import type {
  DefaultCombinatorName,
  DefaultRuleGroupArray,
  DefaultRuleGroupType,
  DefaultRuleType,
  RuleGroupArray,
  RuleGroupType,
  RuleType,
} from './ruleGroups';
import type { MappedTuple } from './ruleGroupsIC.utils';

export type RuleGroupTypeIC<R extends RuleType = RuleType, C extends string = string> = Omit<
  RuleGroupType<R, C>,
  'combinator' | 'rules'
> & {
  // TODO: prohibit combinator property in IC groups
  // combinator?: never;
  rules: RuleGroupICArray<RuleGroupTypeIC<R, C>, R, C>;
  /**
   * Only used when adding a rule to a query that uses independent combinators
   */
  combinatorPreceding?: C;
};

export type RuleGroupTypeAny = RuleGroupType | RuleGroupTypeIC;

export type RuleGroupICArray<
  RG extends RuleGroupTypeIC = RuleGroupTypeIC,
  R extends RuleType = RuleType,
  C extends string = string
> = [R | RG] | [R | RG, ...MappedTuple<[C, R | RG]>] | ((R | RG)[] & { length: 0 });
export type RuleOrGroupArray = RuleGroupArray | RuleGroupICArray;

export type DefaultRuleGroupICArray = RuleGroupICArray<
  DefaultRuleGroupTypeIC,
  DefaultRuleType,
  DefaultCombinatorName
>;

export type DefaultRuleOrGroupArray = DefaultRuleGroupArray | DefaultRuleGroupICArray;

export interface DefaultRuleGroupTypeIC extends RuleGroupTypeIC {
  rules: DefaultRuleGroupICArray;
}

export type DefaultRuleGroupTypeAny = DefaultRuleGroupType | DefaultRuleGroupTypeIC;
