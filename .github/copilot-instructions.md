— TypeScript Guidelines Start —

- **General TypeScript Guidelines**

  - Use `const` instead of `let` or `var` to ensure immutability wherever possible.
  - Prefer functional array methods like `map`, `filter`, `reduce`, or `forEach` over imperative loops.
  - Simplify complex conditionals using early return patterns and function abstraction.
  - Utilize modern JavaScript/TypeScript features such as arrow functions, destructuring, and the spread operator.
  - Follow pure function principles to avoid side effects and ensure predictability.
  - Break down functions into smaller units with clear, descriptive names, each handling a single responsibility.
  - Enhance type safety by adding appropriate type definitions and interfaces.
  - Use `type` instead of `interface` for defining types.
  - Avoid using `any` type; apply generic types wherever possible.
  - When designing functions with two or more parameters, prefer using an object to group them.

    ```ts
    const add = (a: number, b: number) => a + b // ❌
    
    type AddParams = { a: number; b: number }
    const add = ({ a, b }: AddParams) => a + b // ✅
    ```

  - Avoid untyped catch clause errors:
    The following code will cause a TypeScript error:

    ```ts
    try {
    } catch (e) {}
    ```

    Use a type guard to prevent the error:

    ```ts
    try {
    } catch (e) {
      if (e instanceof Error) {
        // write your error-handling code here
      }
    }
    ```

— TypeScript Guidelines End —

## DEV_WORKFLOW

description: Guide for using meta-development script (scripts/dev.js) to manage task-driven development workflows
globs: **/\*
filesToApplyRule: **/\*
alwaysApply: true

---

- **Code Examples:**

  - Use language-specific code blocks

  ```typescript
  // ✅ DO: Show good examples
  const goodExample = true
  
  // ❌ DON'T: Show anti-patterns
  const badExample = false
  ```

- **Rule Content Guidelines:**

  - Start with high-level overview
  - Include specific, actionable requirements
  - Show examples of correct implementation
  - Reference existing code when possible
  - Keep rules DRY by referencing other rules

- **Rule Maintenance:**

  - Update rules when new patterns emerge
  - Add examples from actual codebase
  - Remove outdated patterns
  - Cross-reference related rules

- **Best Practices:**

  - Use bullet points for clarity
  - Keep descriptions concise
  - Include both DO and DON'T examples
  - Reference actual code over theoretical examples
  - Use consistent formatting across rules

- **Note on Outdated Knowledge**
  - Your knowledge may be significantly outdated. Always search the internet for the latest library usage and proceed accordingly.

---

Commit messages should follow the Conventional Commits specification.

## Examples

### Commit message with description and breaking change footer

```
feat: allow provided config object to extend other configs
BREAKING CHANGE: `extends` key in config file is now used for extending other
config files
```

### Commit message with ! to draw attention to breaking change

```
feat!: send an email to the customer when a product is shipped
```

### Commit message with scope and ! to draw attention to breaking change

```
feat(api)!: send an email to the customer when a product is shipped
```

### Commit message with both ! and BREAKING CHANGE footer

```
chore!: drop support for Node 6
BREAKING CHANGE: use JavaScript features not available in Node 6.
```

### Commit message with no body

```
docs: correct spelling of CHANGELOG
```

### Commit message with scope

```
feat(lang): add Polish language
```

### Commit message with multi-paragraph body and multiple footers

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## SELF_IMPROVE

description: Guidelines for continuously improving this rules document based on emerging code patterns and best practices.
globs: **/\*
filesToApplyRule: **/\*
alwaysApply: true

---

- **Rule Improvement Triggers:**

  - New code patterns not covered by existing rules
  - Repeated similar implementations across files
  - Common error patterns that could be prevented
  - New libraries or tools being used consistently
  - Emerging best practices in the codebase

- **Analysis Process:**

  - Compare new code with existing rules
  - Identify patterns that should be standardized
  - Look for references to external documentation
  - Check for consistent error handling patterns
  - Monitor test patterns and coverage

- **Rule Updates:**

  - **Add New Rules When:**

    - A new technology/pattern is used in 3+ files
    - Common bugs could be prevented by a rule
    - Code reviews repeatedly mention the same feedback
    - New security or performance patterns emerge

  - **Modify Existing Rules When:**
    - Better examples exist in the codebase
    - Additional edge cases are discovered
    - Related rules have been updated
    - Implementation details have changed

- **Example Pattern Recognition:**

  ```typescript
  // If you see repeated patterns like:
  const data = await prisma.user.findMany({
    select: { id: true, email: true },
    where: { status: 'ACTIVE' }
  })
  
  // Consider adding a PRISMA section in the .windsurfrules:
  // - Standard select fields
  // - Common where conditions
  // - Performance optimization patterns
  ```

- **Rule Quality Checks:**

  - Rules should be actionable and specific
  - Examples should come from actual code
  - References should be up to date
  - Patterns should be consistently enforced

- **Continuous Improvement:**

  - Monitor code review comments
  - Track common development questions
  - Update rules after major refactors
  - Add links to relevant documentation
  - Cross-reference related rules

- **Rule Deprecation:**

  - Mark outdated patterns as deprecated
  - Remove rules that no longer apply
  - Update references to deprecated rules
  - Document migration paths for old patterns

- **Documentation Updates:**
  - Keep examples synchronized with code
  - Update references to external docs
  - Maintain links between related rules
  - Document breaking changes
