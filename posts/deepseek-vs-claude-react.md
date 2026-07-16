# 同题对比：让 DeepSeek 和 Claude 写同一个 React 组件

> 同一个需求，两个模型，谁写得更好？我让 DeepSeek 和 Claude 各自实现一个 React 组件，从代码质量、可维护性和细节理解三个维度做了一场对比评测。

## 测试设计

### 测试题目

让 AI 实现一个 **搜索下拉选择器** 组件，需求如下：

- 支持输入关键词搜索
- 搜索结果下拉展示
- 支持键盘上下选择 + 回车确认
- 支持防抖（300ms）
- 加载状态和空结果提示
- TypeScript 类型定义完整
- 不依赖第三方 UI 库

### 测试环境

| 条件 | DeepSeek | Claude |
|------|------|------|
| 模型 | `deepseek-chat` | `claude-sonnet-5` |
| 接入方式 | Cline 插件 | Cline 插件 |
| 同一 Prompt | ✅ 完全一致 | ✅ 完全一致 |

### Prompt

```text
请实现一个 React 搜索下拉选择器组件 SearchSelect，要求：
1. 输入关键词后 300ms 防抖搜索
2. 下拉列表展示搜索结果，支持键盘上下键选择、回车确认
3. 搜索中和无结果时分别展示加载状态和空状态
4. 完整的 TypeScript 类型
5. 不依赖第三方 UI 库
6. 使用函数组件 + Hooks
请直接输出完整可运行的代码。
```

## 代码对比

### DeepSeek 的实现

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SearchSelectProps<T> {
  onSearch: (keyword: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  placeholder?: string;
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
}

export function SearchSelect<T>({
  onSearch,
  onSelect,
  placeholder = '请输入关键词搜索...',
  renderItem,
  getItemKey,
}: SearchSelectProps<T>) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // 防抖搜索
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await onSearch(keyword);
        setResults(data);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [keyword, onSearch]);

  // 键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            handleSelect(results[activeIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [activeIndex, isOpen, results]
  );

  const handleSelect = (item: T) => {
    onSelect(item);
    setKeyword('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // 滚动可见
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '8px 12px', fontSize: '14px',
          border: '1px solid #d9d9d9', borderRadius: '6px' }}
      />

      {isOpen && (
        <ul
          ref={listRef}
          style={{ position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#fff', border: '1px solid #e8e8e8',
            borderRadius: '6px', marginTop: '4px',
            maxHeight: '240px', overflowY: 'auto', listStyle: 'none',
            padding: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          {loading ? (
            <li style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
              搜索中...
            </li>
          ) : results.length === 0 ? (
            <li style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
              无匹配结果
            </li>
          ) : (
            results.map((item, index) => (
              <li
                key={getItemKey(item)}
                onClick={() => handleSelect(item)}
                style={{ padding: '8px 12px', cursor: 'pointer',
                  background: index === activeIndex ? '#e6f7ff' : 'transparent' }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {renderItem(item)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
```

### Claude 的实现

```tsx
import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';

// ========== 类型定义 ==========
interface Option<T = string> {
  value: T;
  label: string;
}

interface SearchSelectProps<T = string> {
  /** 搜索函数，返回 Promise */
  fetchOptions: (query: string) => Promise<Option<T>[]>;
  /** 选中回调 */
  onChange: (option: Option<T>) => void;
  /** 占位文字 */
  placeholder?: string;
  /** 最小搜索长度 */
  minSearchLength?: number;
}

// ========== 自定义 Hook: 防抖 ==========
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ========== 组件 ==========
export function SearchSelect<T = string>({
  fetchOptions,
  onChange,
  placeholder = '搜索...',
  minSearchLength = 1,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<Option<T>[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>(
    'idle',
  );

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const abortRef = useRef<AbortController>();

  // 搜索逻辑
  useEffect(() => {
    if (debouncedQuery.length < minSearchLength) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    // 取消上一次请求
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setStatus('loading');
    setIsOpen(true);

    fetchOptions(debouncedQuery)
      .then((results) => {
        setOptions(results);
        setHighlightIndex(-1);
        setStatus('idle');
        // 保持 isOpen = true
      })
      .catch((err) => {
        if ((err as Error).name !== 'AbortError') {
          setStatus('error');
          setOptions([]);
        }
      });
  }, [debouncedQuery, fetchOptions, minSearchLength]);

  // 键盘导航
  const nav = useMemo(
    () => ({
      down: () =>
        setHighlightIndex((i) =>
          Math.min(i + 1, options.length - 1),
        ),
      up: () =>
        setHighlightIndex((i) => Math.max(i - 1, 0)),
    }),
    [options.length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
        case 'ArrowDown':
          e.preventDefault();
          nav.down();
          break;
        case 'ArrowUp':
          e.preventDefault();
          nav.up();
          break;
        case 'Enter':
          e.preventDefault();
          if (options[highlightIndex]) {
            onChange(options[highlightIndex]);
            setQuery('');
            setIsOpen(false);
          }
          break;
      }
    },
    [options, highlightIndex, onChange, nav],
  );

  // 高亮项自动滚动
  useEffect(() => {
    const el = listboxRef.current?.children[highlightIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex]);

  return (
    <div className="search-select" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (options.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        style={inputStyle}
      />

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          style={dropdownStyle}
        >
          {status === 'loading' && (
            <li style={hintStyle}>⏳ 搜索中...</li>
          )}

          {status === 'error' && (
            <li style={{ ...hintStyle, color: '#ff4d4f' }}>
              ⚠️ 搜索失败，请重试
            </li>
          )}

          {status === 'idle' && options.length === 0 && (
            <li style={hintStyle}>📭 没有找到结果</li>
          )}

          {options.map((opt, idx) => (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={idx === highlightIndex}
              onClick={() => {
                onChange(opt);
                setQuery('');
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightIndex(idx)}
              style={{
                ...optionStyle,
                background:
                  idx === highlightIndex ? '#e6f7ff' : 'transparent',
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ========== 行内样式（演示用，实际项目用 CSS Module）==========
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: 14,
  border: '1px solid #d9d9d9',
  borderRadius: 6,
  outline: 'none',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 4,
  maxHeight: 240,
  overflowY: 'auto',
  background: '#fff',
  border: '1px solid #e8e8e8',
  borderRadius: 6,
  boxShadow: '0 2px 8px rgba(0,0,0,.1)',
  padding: 0,
  listStyle: 'none',
  zIndex: 1000,
};

const optionStyle: React.CSSProperties = {
  padding: '8px 12px',
  cursor: 'pointer',
};

const hintStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'center',
  color: '#999',
};

export default SearchSelect;
```

## 功能对比

| 维度 | DeepSeek | Claude | 胜出 |
|------|------|------|:---:|
| **组件命名** | `SearchSelect` | `SearchSelect` | 平 |
| **泛型支持** | `<T>` 完整 | `<T = string>` + 默认值 | Claude |
| **Props 设计** | `onSearch`, `onSelect` | `fetchOptions`, `onChange` | 平 |
| **防抖** | useRef + setTimeout | 自定义 `useDebounce` Hook | 平 |
| **键盘导航** | ✅ 上下+回车+Esc | ✅ 上下+回车+Esc | 平 |
| **加载状态** | `loading` 布尔 | `'idle' | 'loading' | 'error'` 三态 | Claude |
| **错误处理** | catch 吞掉错误 | AbortController + 错误区分 | Claude |
| **无障碍(A11y)** | ❌ 无 ARIA | ✅ role + aria 属性 | Claude |
| **请求取消** | ❌ 无 | ✅ AbortController | Claude |
| **最小搜索长度** | 手动 trim 判断 | `minSearchLength` 配置项 | Claude |
| **自定义渲染** | `renderItem` + `getItemKey` | 统一为 `Option` 类型 | 平（不同设计理念） |
| **Hooks 抽象** | 无 | 抽离 `useDebounce` | Claude |
| **代码组织** | 功能优先 | 类型→Hook→组件 分层清晰 | Claude |
| **注释/文档** | 无 | JSDoc 注释 + 区域标记 | Claude |

## 深度分析

### 1. 类型安全性

两个都提供了泛型支持，但 Claude 额外提供了 `T = string` 默认值，对简单场景更友好。

### 2. 加载与错误状态

**DeepSeek** 用了简单的 `loading` 布尔值，错误直接吞掉，用户看不到反馈。

**Claude** 用了三态模型 `'idle' | 'loading' | 'error'`，并且渲染了三种不同 UI。这是生产级代码的思路——**状态机而非布尔**。

### 3. 请求竞态问题

这是一个容易忽视但很关键的细节：如果用户快速输入 "a" → "ab" → "abc"，三次请求可能以任意顺序返回。

**DeepSeek** 没有处理这个问题，可能出现"新结果被旧结果覆盖"的 bug。

**Claude** 使用了 `AbortController`，每次新搜索前取消上一次请求，完美解决了竞态。

### 4. 无障碍访问

**Claude** 实现了 `role="combobox"`、`aria-expanded`、`aria-autocomplete` 等属性，这是 DeepSeek 完全没有考虑的。

### 5. 代码可维护性

Claude 把 `useDebounce` 抽成独立 Hook、样式集中定义、区域用注释标记，整体结构更工程化。

## 结论

| 评分维度 | DeepSeek | Claude |
|------|:---:|:---:|
| 功能完成度 | 7/10 | 9/10 |
| 代码质量 | 7/10 | 9/10 |
| 边界情况 | 6/10 | 8/10 |
| 工程化程度 | 6/10 | 9/10 |
| **综合** | **6.5** | **8.75** |

Claude 在工程细节上明显更胜一筹，特别是在错误处理、竞态防护和无障碍访问这些"容易忽略但很重要"的方面。

但 DeepSeek 的实现也是**可用的**，并且在基本功能（搜索、选择、键盘导航）上与 Claude 没有实质差距。考虑到 DeepSeek 的价格是 Claude 的 1/15 左右，日常使用性价比极高。

## 实践建议

- **原型/MVP 阶段**：用 DeepSeek，快速出活
- **生产级组件**：用 Claude，关注边界情况
- **最佳实践**：先用 DeepSeek 生成初版，再用 Claude Review 和补充边界处理

---

> 🤖 **AI 参与度**: 本文对比实验由两个模型各自完成编码，人工分析对比、撰写评测，人工修改占比约 **60%**。

*发布于 2026 年 7 月*
