// __IMPORTS__
import { useState } from 'react';
import type { Field, RuleGroupType } from 'react-querybuilder';
import { formatQuery, QueryBuilder } from 'react-querybuilder';
import './styles.scss';

// __ADDITIONAL_DECLARATIONS__

const fields: Field[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const initialQuery: RuleGroupType = {
  combinator: 'and',
  rules: [
    { field: 'firstName', operator: 'beginsWith', value: 'Stev' },
    { field: 'lastName', operator: 'in', value: 'Vai,Vaughan' },
  ],
};

export const App = () => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <div>
      {/* __WRAPPER_OPEN__ */}
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={q => setQuery(q)}
        // __RQB_PROPS__
      />
      {/* __WRAPPER_CLOSE__ */}
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, 'json')}</code>
      </pre>
    </div>
  );
};
