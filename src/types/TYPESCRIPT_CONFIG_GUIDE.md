/**
 * TypeScript Configuration Examples
 * 
 * These are example configurations to help you set up your TypeScript project
 * to work optimally with the generated schema types.
 */

// =========================
// tsconfig.json Example
// =========================

/*
{
  "compilerOptions": {
    // TypeScript version and target
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Module resolution
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    
    // Path aliases (IMPORTANT for clean imports)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/schemas/*": ["./app/schemas/*"],
      "@/schemas/types": ["./app/schemas/types/index.ts"]
    },
    
    // Strict type checking (RECOMMENDED)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // Declaration
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // Interop constraints
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    
    // Skip lib check (optional, for faster compilation)
    "skipLibCheck": true
  },
  "include": ["src/**/*", "app/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
*/

// =========================
// Next.js tsconfig.json
// =========================

/*
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/schemas/types": ["./app/schemas/types/index.ts"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
*/

// =========================
// Vite tsconfig.json
// =========================

/*
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/schemas/types": ["./app/schemas/types/index.ts"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*", "app/**/*"],
  "exclude": ["node_modules", "dist"]
}
*/

// =========================
// .eslintrc.json (with type imports)
// =========================

/*
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "no-unused-vars": "off"
  }
}
*/

// =========================
// prettier.json Example
// =========================

/*
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
*/

// =========================
// Common Setup Patterns
// =========================

/**
 * PATTERN 1: Re-export from a local index for clean API
 */

// src/types/index.ts
// export type * from '@/schemas/types';

/**
 * PATTERN 2: Create API client with types
 */

// src/api/client.ts
/*
import type { CompanyRead, UserRead } from '@/schemas/types';

export const api = {
  companies: {
    get: async (symbol: string): Promise<CompanyRead> => {
      const res = await fetch(`/api/v1/companies/${symbol}`);
      return res.json();
    },
  },
  users: {
    get: async (id: number): Promise<UserRead> => {
      const res = await fetch(`/api/v1/users/${id}`);
      return res.json();
    },
  },
};
*/

/**
 * PATTERN 3: Create custom hooks for data fetching
 */

// src/hooks/useCompany.ts
/*
import { useQuery } from '@tanstack/react-query';
import type { CompanyRead } from '@/schemas/types';

export function useCompany(symbol: string) {
  return useQuery<CompanyRead>({
    queryKey: ['company', symbol],
    queryFn: async () => {
      const res = await fetch(`/api/v1/companies/${symbol}`);
      if (!res.ok) throw new Error('Failed to fetch company');
      return res.json();
    },
  });
}
*/

/**
 * PATTERN 4: Create Axios instance with types
 */

// src/api/axios.ts
/*
import axios from 'axios';
import type { CompanyRead, UserRead } from '@/schemas/types';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export const getCompany = (symbol: string) =>
  instance.get<CompanyRead>(`/api/v1/companies/${symbol}`);

export const getUser = (id: number) =>
  instance.get<UserRead>(`/api/v1/users/${id}`);
*/

/**
 * PATTERN 5: Create REST client generator
 */

// src/api/rest-client.ts
/*
import type { CompanyPageResponse, CompanyRead } from '@/schemas/types';

export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  // Company endpoints
  getCompany(symbol: string) {
    return this.get<CompanyRead>(`/api/v1/companies/${symbol}`);
  }

  getCompanyPage(symbol: string) {
    return this.get<CompanyPageResponse>(`/api/v1/companies/${symbol}/page`);
  }
}

// Usage
// const client = new ApiClient();
// const company = await client.getCompany('AAPL');
*/

/**
 * PATTERN 6: Environment-specific types
 */

// src/types/api.ts
/*
import type {
  CompanyRead,
  PortfolioRead,
  UserRead,
} from '@/schemas/types';

// Add custom fields for UI logic
export interface CompanyWithUI extends CompanyRead {
  isSelected?: boolean;
  isFavorite?: boolean;
}

export interface PortfolioWithCalculations extends PortfolioRead {
  monthlyReturn: number;
  annualizedReturn: number;
}
*/

/**
 * PATTERN 7: API Response wrapper
 */

// src/types/api-response.ts
/*
import type { CompanyRead } from '@/schemas/types';

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
  timestamp: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Type guards
export const isSuccess = <T,>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T; error: null } => {
  return response.error === null;
};

export const isError = <T,>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: null; error: string } => {
  return response.error !== null;
};
*/

/**
 * PATTERN 8: Form data types
 */

// src/types/forms.ts
/*
import type { PortfolioTradingHistoryWrite } from '@/schemas/types';

export interface TradeFormData
  extends Omit<PortfolioTradingHistoryWrite, 'portfolio_id'> {
  // Form-specific fields
  confirmBeforeSave?: boolean;
  autoCalculateNetTotal?: boolean;
}
*/

// =========================
// Recommended npm packages with types support
// =========================

/*
Dependencies (in package.json):

{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.5.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.48.0",
    "prettier": "^3.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0"
  }
}
*/

// All types are now ready to use with full TypeScript support! 🎉
