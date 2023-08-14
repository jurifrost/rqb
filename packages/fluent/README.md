## @react-querybuilder/fluent

Official [react-querybuilder](https://npmjs.com/package/react-querybuilder) components for [Fluent UI](https://github.com/microsoft/fluentui).

To see them in action, check out the [`react-querybuilder` demo](https://react-querybuilder.js.org/demo/fluent) or [load the example in CodeSandbox](https://codesandbox.io/s/github/react-querybuilder/react-querybuilder/tree/main/examples/fluent).

**[Full documentation](https://react-querybuilder.js.org/)**

## Installation

```bash
npm i --save react-querybuilder @react-querybuilder/fluent @fluentui/react-components
# OR
yarn add react-querybuilder @react-querybuilder/fluent @fluentui/react-components
```

## Usage

To render Fluent UI-compatible components in the query builder, wrap the `<QueryBuilder />` element in `<QueryBuilderFluent />`.

```tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { QueryBuilderFluent } from '@react-querybuilder/fluent';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';

const fields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];

const App = () => {
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });

  return (
    <FluentProvider theme={webLightTheme}>
      <QueryBuilderFluent>
        <QueryBuilder fields={fields} query={query} onQueryChange={q => setQuery(q)} />
      </QueryBuilderFluent>
    </FluentProvider>
  );
};
```

## Notes

- This package exports `fluentControlElements` which can be assigned directly to the `controlElements` prop on `<QueryBuilder />` (and also exports each component individually), but wrapping `<QueryBuilder />` in `<QueryBuilderFluent />` is the recommended method.
