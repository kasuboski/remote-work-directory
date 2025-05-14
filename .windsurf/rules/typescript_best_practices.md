---
trigger: glob
globs: **/*.ts, **/*.tsx
---

# TypeScript Best Practices for kasuboski/delivery-platform

This document outlines the preferred TypeScript coding style and practices for this project to ensure code quality, maintainability, and type safety.

## Core Principles

1.  **Strong Typing is Preferred:** Always strive to provide explicit types for variables, function parameters, and return values. Leverage TypeScript's type inference where it enhances clarity, but don't rely on it when ambiguity could arise.
2.  **Avoid `any`:** The use of the `any` type defeats the purpose of TypeScript and should be avoided whenever possible. It bypasses type checking and can hide potential runtime errors.
3.  **Use Specific Types:** Prefer specific types (e.g., `string`, `number`, custom interfaces/types) over overly broad types like `object` or `Function`.
4.  **Leverage `unknown` over `any`:** If a type is truly unknown, use the `unknown` type. This forces type checking or assertion before the value can be used, making it safer than `any`.
5.  **Employ Type Guards:** When dealing with unions or types that need narrowing (like `unknown`), use type guards (e.g., `typeof`, `instanceof`, `in` operator, or custom predicate functions) to safely determine the specific type within a block of code.

## Specific Guidelines

*   **Function Signatures:** Clearly define types for all function parameters and return values.
    ```typescript
    // Good
    function processData(data: UserData): ProcessedResult {
      // ... implementation ...
    }

    // Avoid
    function processData(data, options?) { // Missing types
      // ...
    }
    ```
*   **Interfaces and Types:** Use `interface` for defining the shape of objects and `type` for unions, intersections, or more complex type aliases. Be descriptive with naming.
    ```typescript
    interface UserProfile {
      userId: string;
      displayName: string;
      email?: string; // Optional property
    }

    type Status = 'pending' | 'processing' | 'completed' | 'failed';
    ```
*   **Handling `any`:**
    *   **Third-Party Libraries:** If a library lacks types, try finding `@types/` packages. If unavailable, consider creating minimal type declarations or using `unknown` and type guards. Use `any` only as a last resort and isolate its usage.
    *   **Refactoring:** If `any` exists in the codebase, prioritize refactoring it to a specific type or `unknown`.
*   **Type Guards Example:**
    ```typescript
    function handleValue(value: unknown) {
      if (typeof value === 'string') {
        console.log('String:', value.toUpperCase());
      } else if (typeof value === 'number') {
        console.log('Number:', value.toFixed(2));
      } else {
        console.log('Unsupported type');
      }
    }
    ```
    Example: when you need a runtime check, use a type-guard to narrow your CF bindings:
```ts
function hasSecret<K extends string>(
  env: CloudflareBindings,
  key: K,
): env is CloudflareBindings & Record<K, string> {
  // biome-ignore lint/suspicious/noExplicitAny: cast as any to further guard type
  return typeof (env as any)[key] === "string";
}
```
*   **Strict Compiler Options:** Enable strict compiler options in `tsconfig.json` (like `strict`, `noImplicitAny`, `strictNullChecks`) to catch potential type errors early.

By adhering to these guidelines, we aim to build a robust, maintainable, and type-safe codebase.