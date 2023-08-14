import * as React from 'react';
import { useContext } from 'react';
import type { QueryBuilderContextProps } from 'react-querybuilder';
import { QueryBuilderContext, useMergedContext, usePreferProp } from 'react-querybuilder';
import { useReactDnD } from './hooks';
import { InlineCombinatorDnD } from './InlineCombinatorDnD';
import { QueryBuilderDndContext } from './QueryBuilderDndContext';
import { RuleDnD } from './RuleDnD';
import { RuleGroupDnD } from './RuleGroupDnD';
import type { QueryBuilderDndProps } from './types';

export const QueryBuilderDnD = (props: QueryBuilderDndProps) => {
  const {
    controlClassnames,
    controlElements,
    debugMode,
    enableDragAndDrop: enableDragAndDropProp,
    enableMountQueryChange,
    translations,
  } = props;

  const rqbContext = useMergedContext({
    controlClassnames,
    controlElements,
    debugMode,
    enableDragAndDrop: enableDragAndDropProp ?? true,
    enableMountQueryChange,
    translations: translations ?? {},
  });
  const { enableDragAndDrop } = rqbContext;

  const dnd = useReactDnD(props.dnd);
  const key = enableDragAndDrop && dnd ? 'dnd' : 'no-dnd';

  if (!enableDragAndDrop || !dnd) {
    return (
      <QueryBuilderContext.Provider
        key={key}
        value={{ ...rqbContext, enableDragAndDrop: false, debugMode }}>
        {props.children}
      </QueryBuilderContext.Provider>
    );
  }

  const { DndProvider, HTML5Backend } = dnd;

  return (
    <DndProvider key={key} backend={HTML5Backend} debugMode={debugMode}>
      <QueryBuilderContext.Provider
        key={key}
        value={{ ...rqbContext, enableDragAndDrop, debugMode }}>
        <QueryBuilderDndWithoutProvider dnd={dnd}>{props.children}</QueryBuilderDndWithoutProvider>
      </QueryBuilderContext.Provider>
    </DndProvider>
  );
};

QueryBuilderDnD.displayName = 'QueryBuilderDnD';

export const QueryBuilderDndWithoutProvider = (props: QueryBuilderDndProps) => {
  const rqbContext = useContext(QueryBuilderContext);
  const rqbDndContext = useContext(QueryBuilderDndContext);
  const dnd = useReactDnD(props.dnd);
  const debugMode = usePreferProp(false, props.debugMode, rqbContext.debugMode);
  const enableDragAndDrop = usePreferProp(
    true,
    props.enableDragAndDrop,
    rqbContext.enableDragAndDrop
  );
  const key = enableDragAndDrop && dnd ? 'dnd' : 'no-dnd';

  if (!enableDragAndDrop || !dnd) {
    return (
      <QueryBuilderContext.Provider
        key={key}
        value={{ ...rqbContext, enableDragAndDrop: false, debugMode }}>
        {props.children}
      </QueryBuilderContext.Provider>
    );
  }

  const { DndContext, useDrag, useDrop } = dnd;

  const baseControls = {
    rule:
      props.controlElements?.rule ??
      rqbContext.controlElements?.rule ??
      rqbDndContext.baseControls.rule,
    ruleGroup:
      props.controlElements?.ruleGroup ??
      rqbContext.controlElements?.ruleGroup ??
      rqbDndContext.baseControls.ruleGroup,
    combinatorSelector:
      props.controlElements?.combinatorSelector ??
      rqbContext.controlElements?.combinatorSelector ??
      rqbDndContext.baseControls.combinatorSelector,
  };

  const newContext: QueryBuilderContextProps = {
    ...rqbContext,
    controlElements: {
      ...rqbContext.controlElements,
      ruleGroup: RuleGroupDnD,
      rule: RuleDnD,
      inlineCombinator: InlineCombinatorDnD,
    },
  };

  return (
    <DndContext.Consumer key={key}>
      {() => (
        <QueryBuilderContext.Provider key={key} value={newContext}>
          <QueryBuilderDndContext.Provider value={{ useDrag, useDrop, baseControls }}>
            {props.children}
          </QueryBuilderDndContext.Provider>
        </QueryBuilderContext.Provider>
      )}
    </DndContext.Consumer>
  );
};

QueryBuilderDndWithoutProvider.displayName = 'QueryBuilderDndWithoutProvider';
