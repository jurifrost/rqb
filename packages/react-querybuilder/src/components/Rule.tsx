import * as React from 'react';
import { TestID } from '../defaults';
import { useRule, useStopEventPropagation } from '../hooks';
import type { RuleProps } from '../types';

export const Rule = (props: RuleProps) => {
  const r = { ...props, ...useRule(props) };

  const { cloneRule, toggleLockRule, removeRule } = r;
  const methodsWithoutEventPropagation = useStopEventPropagation({
    cloneRule,
    toggleLockRule,
    removeRule,
  });

  const subComponentProps = { ...r, ...methodsWithoutEventPropagation };

  return (
    <div
      ref={r.dndRef}
      data-testid={TestID.rule}
      data-dragmonitorid={r.dragMonitorId}
      data-dropmonitorid={r.dropMonitorId}
      className={r.outerClassName}
      data-rule-id={r.id}
      data-level={r.path.length}
      data-path={JSON.stringify(r.path)}>
      <RuleComponents {...subComponentProps} />
    </div>
  );
};

Rule.displayName = 'Rule';

export const RuleComponents = (r: RuleProps & ReturnType<typeof useRule>) => {
  const {
    schema: {
      controls: {
        dragHandle: DragHandleControlElement,
        fieldSelector: FieldSelectorControlElement,
        operatorSelector: OperatorSelectorControlElement,
        valueSourceSelector: ValueSourceSelectorControlElement,
        valueEditor: ValueEditorControlElement,
        cloneRuleAction: CloneRuleActionControlElement,
        lockRuleAction: LockRuleActionControlElement,
        removeRuleAction: RemoveRuleActionControlElement,
      },
    },
  } = r;

  return (
    <>
      <DragHandleControlElement
        testID={TestID.dragHandle}
        ref={r.dragRef}
        level={r.path.length}
        path={r.path}
        title={r.translations.dragHandle.title}
        label={r.translations.dragHandle.label}
        className={r.classNames.dragHandle}
        disabled={r.disabled}
        context={r.context}
        validation={r.validationResult}
        schema={r.schema}
      />
      <FieldSelectorControlElement
        testID={TestID.fields}
        options={r.schema.fields}
        title={r.translations.fields.title}
        value={r.rule.field}
        operator={r.rule.operator}
        className={r.classNames.fields}
        handleOnChange={r.generateOnChangeHandler('field')}
        level={r.path.length}
        path={r.path}
        disabled={r.disabled}
        context={r.context}
        validation={r.validationResult}
        schema={r.schema}
      />
      {(r.schema.autoSelectField || r.rule.field !== r.translations.fields.placeholderName) && (
        <>
          <OperatorSelectorControlElement
            testID={TestID.operators}
            field={r.rule.field}
            fieldData={r.fieldData}
            title={r.translations.operators.title}
            options={r.operators}
            value={r.rule.operator}
            className={r.classNames.operators}
            handleOnChange={r.generateOnChangeHandler('operator')}
            level={r.path.length}
            path={r.path}
            disabled={r.disabled}
            context={r.context}
            validation={r.validationResult}
            schema={r.schema}
          />
          {(r.schema.autoSelectOperator ||
            r.rule.operator !== r.translations.operators.placeholderName) &&
            !r.hideValueControls && (
              <>
                {!['null', 'notNull'].includes(r.rule.operator) && r.valueSources.length > 1 && (
                  <ValueSourceSelectorControlElement
                    testID={TestID.valueSourceSelector}
                    field={r.rule.field}
                    fieldData={r.fieldData}
                    title={r.translations.valueSourceSelector.title}
                    options={r.valueSourceOptions}
                    value={r.rule.valueSource ?? 'value'}
                    className={r.classNames.valueSource}
                    handleOnChange={r.generateOnChangeHandler('valueSource')}
                    level={r.path.length}
                    path={r.path}
                    disabled={r.disabled}
                    context={r.context}
                    validation={r.validationResult}
                    schema={r.schema}
                  />
                )}
                <ValueEditorControlElement
                  testID={TestID.valueEditor}
                  field={r.rule.field}
                  fieldData={r.fieldData}
                  title={r.translations.value.title}
                  operator={r.rule.operator}
                  value={r.rule.value}
                  valueSource={r.rule.valueSource ?? 'value'}
                  type={r.valueEditorType}
                  inputType={r.inputType}
                  values={r.values}
                  listsAsArrays={r.schema.listsAsArrays}
                  parseNumbers={r.schema.parseNumbers}
                  separator={r.valueEditorSeparator}
                  className={r.classNames.value}
                  handleOnChange={r.generateOnChangeHandler('value')}
                  level={r.path.length}
                  path={r.path}
                  disabled={r.disabled}
                  context={r.context}
                  validation={r.validationResult}
                  schema={r.schema}
                />
              </>
            )}
        </>
      )}
      {r.schema.showCloneButtons && (
        <CloneRuleActionControlElement
          testID={TestID.cloneRule}
          label={r.translations.cloneRule.label}
          title={r.translations.cloneRule.title}
          className={r.classNames.cloneRule}
          handleOnClick={r.cloneRule}
          level={r.path.length}
          path={r.path}
          disabled={r.disabled}
          context={r.context}
          validation={r.validationResult}
          ruleOrGroup={r.rule}
          schema={r.schema}
        />
      )}
      {r.schema.showLockButtons && (
        <LockRuleActionControlElement
          testID={TestID.lockRule}
          label={r.translations.lockRule.label}
          title={r.translations.lockRule.title}
          className={r.classNames.lockRule}
          handleOnClick={r.toggleLockRule}
          level={r.path.length}
          path={r.path}
          disabled={r.disabled}
          disabledTranslation={r.parentDisabled ? undefined : r.translations.lockRuleDisabled}
          context={r.context}
          validation={r.validationResult}
          ruleOrGroup={r.rule}
          schema={r.schema}
        />
      )}
      <RemoveRuleActionControlElement
        testID={TestID.removeRule}
        label={r.translations.removeRule.label}
        title={r.translations.removeRule.title}
        className={r.classNames.removeRule}
        handleOnClick={r.removeRule}
        level={r.path.length}
        path={r.path}
        disabled={r.disabled}
        context={r.context}
        validation={r.validationResult}
        ruleOrGroup={r.rule}
        schema={r.schema}
      />
    </>
  );
};
