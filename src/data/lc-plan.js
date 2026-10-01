// LeetCode side of the 8-week plan.
// Days 1–38 follow ~/.claude/skills/leetcode-coach/roadmap.md (picking up at Encode and Decode Strings),
// days 39–48 add NeetCode 150 extras, days 50–55 are timed mock sets. Every 7th day is a review day.

export const TOPICS = {
  arrays: {
    name: 'Arrays & Hashing',
    pattern: 'Use a set/map for O(1) lookup instead of re-scanning.',
    trigger: '"Have I seen this before?", counting, grouping, or "find the pair that…".',
  },
  twoptr: {
    name: 'Two Pointers',
    pattern: 'Converging or paired indices over sorted / symmetric data.',
    trigger: 'Sorted input, palindromes, "pair/triplet that sums to X", in-place compaction.',
  },
  window: {
    name: 'Sliding Window',
    pattern: 'Grow the right edge, shrink the left while the window is invalid.',
    trigger: '"Longest/shortest contiguous subarray or substring such that…".',
  },
  stack: {
    name: 'Stack',
    pattern: 'LIFO for matching; monotonic stack for "next greater/smaller".',
    trigger: 'Brackets, nested structure, expression evaluation, "next warmer day".',
  },
  bsearch: {
    name: 'Binary Search',
    pattern: 'Halve a sorted search space — including searching over the answer.',
    trigger: 'Sorted/rotated input, O(log n) asked, or "minimum X such that condition holds".',
  },
  linked: {
    name: 'Linked List',
    pattern: 'Pointer surgery with dummy heads; fast/slow pointers.',
    trigger: 'Reverse, merge, reorder, detect a cycle, find the middle or Nth-from-end.',
  },
  trees: {
    name: 'Trees',
    pattern: 'Recursive DFS (what does each subtree return?) or level-order BFS.',
    trigger: 'Any binary tree / BST question; "depth", "path", "level", "ancestor".',
  },
  heap: {
    name: 'Heap / Priority Queue',
    pattern: 'Keep the top-k or running min/max in a heap.',
    trigger: '"K largest/closest", streaming data, always need the current extreme.',
  },
  backtrack: {
    name: 'Backtracking',
    pattern: 'Choose → recurse → un-choose, pruning dead branches.',
    trigger: '"Generate all" subsets / permutations / combinations / paths.',
  },
  graphs: {
    name: 'Graphs',
    pattern: 'DFS/BFS over grids or adjacency lists; topological sort; union-find.',
    trigger: 'Islands, connectivity, dependencies/prerequisites, shortest path.',
  },
  tries: {
    name: 'Tries',
    pattern: 'A tree of characters for prefix lookups.',
    trigger: '"Starts with", autocomplete, word dictionaries with wildcards.',
  },
  dp: {
    name: 'Dynamic Programming',
    pattern: 'Define the subproblem, write the recurrence, memoize or tabulate.',
    trigger: '"Number of ways", "min/max cost", choices that overlap across subproblems.',
  },
  greedy: {
    name: 'Intervals & Greedy',
    pattern: 'Sort, then sweep making the locally best choice.',
    trigger: 'Intervals/meetings, "can you reach the end", scheduling.',
  },
};

const P = (slug, name, diff, topic, target, extra = {}) => ({ slug, name, diff, topic, target, ...extra });
const NC = (s) => ({ url: `https://neetcode.io/problems/${s}/question`, premium: true });

const LIST = [
  // Already done before the app (seeded below)
  P('contains-duplicate', 'Contains Duplicate', 'E', 'arrays', 'O(n) time, O(n) space'),
  P('valid-anagram', 'Valid Anagram', 'E', 'arrays', 'O(n) time, O(1) space'),
  P('two-sum', 'Two Sum', 'E', 'arrays', 'O(n) time, O(n) space'),
  P('group-anagrams', 'Group Anagrams', 'M', 'arrays', 'O(n·k) time'),
  P('top-k-frequent-elements', 'Top K Frequent Elements', 'M', 'arrays', 'O(n) with bucket sort'),
  P('longest-consecutive-sequence', 'Longest Consecutive Sequence', 'M', 'arrays', 'O(n) time'),

  P('encode-and-decode-strings', 'Encode and Decode Strings', 'M', 'arrays', 'O(n) time', NC('string-encode-and-decode')),
  P('product-of-array-except-self', 'Product of Array Except Self', 'M', 'arrays', 'O(n) time, O(1) extra space'),

  P('valid-palindrome', 'Valid Palindrome', 'E', 'twoptr', 'O(n) time, O(1) space'),
  P('two-sum-ii-input-array-is-sorted', 'Two Sum II – Input Array Is Sorted', 'M', 'twoptr', 'O(n) time, O(1) space'),
  P('3sum', '3Sum', 'M', 'twoptr', 'O(n²) time'),
  P('container-with-most-water', 'Container With Most Water', 'M', 'twoptr', 'O(n) time'),
  P('trapping-rain-water', 'Trapping Rain Water', 'H', 'twoptr', 'O(n) time, O(1) space'),

  P('best-time-to-buy-and-sell-stock', 'Best Time to Buy and Sell Stock', 'E', 'window', 'O(n) time'),
  P('longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'M', 'window', 'O(n) time'),
  P('longest-repeating-character-replacement', 'Longest Repeating Character Replacement', 'M', 'window', 'O(n) time'),
  P('permutation-in-string', 'Permutation in String', 'M', 'window', 'O(n) time'),
  P('minimum-window-substring', 'Minimum Window Substring', 'H', 'window', 'O(m + n) time'),

  P('valid-parentheses', 'Valid Parentheses', 'E', 'stack', 'O(n) time'),
  P('min-stack', 'Min Stack', 'M', 'stack', 'O(1) per operation'),
  P('evaluate-reverse-polish-notation', 'Evaluate Reverse Polish Notation', 'M', 'stack', 'O(n) time'),
  P('generate-parentheses', 'Generate Parentheses', 'M', 'stack', 'O(4ⁿ/√n) — Catalan'),
  P('daily-temperatures', 'Daily Temperatures', 'M', 'stack', 'O(n) monotonic stack'),
  P('car-fleet', 'Car Fleet', 'M', 'stack', 'O(n log n) time'),

  P('binary-search', 'Binary Search', 'E', 'bsearch', 'O(log n) time'),
  P('search-a-2d-matrix', 'Search a 2D Matrix', 'M', 'bsearch', 'O(log(m·n)) time'),
  P('koko-eating-bananas', 'Koko Eating Bananas', 'M', 'bsearch', 'O(n log max) time'),
  P('find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', 'M', 'bsearch', 'O(log n) time'),
  P('search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', 'M', 'bsearch', 'O(log n) time'),
  P('time-based-key-value-store', 'Time Based Key-Value Store', 'M', 'bsearch', 'O(log n) per get'),

  P('reverse-linked-list', 'Reverse Linked List', 'E', 'linked', 'O(n) time, O(1) space'),
  P('merge-two-sorted-lists', 'Merge Two Sorted Lists', 'E', 'linked', 'O(n + m) time'),
  P('linked-list-cycle', 'Linked List Cycle', 'E', 'linked', 'O(n) time, O(1) space'),
  P('reorder-list', 'Reorder List', 'M', 'linked', 'O(n) time, O(1) space'),
  P('remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List', 'M', 'linked', 'One pass'),
  P('copy-list-with-random-pointer', 'Copy List with Random Pointer', 'M', 'linked', 'O(n) time'),
  P('add-two-numbers', 'Add Two Numbers', 'M', 'linked', 'O(max(m, n)) time'),
  P('lru-cache', 'LRU Cache', 'M', 'linked', 'O(1) get and put'),

  P('invert-binary-tree', 'Invert Binary Tree', 'E', 'trees', 'O(n) time'),
  P('maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', 'E', 'trees', 'O(n) time'),
  P('diameter-of-binary-tree', 'Diameter of Binary Tree', 'E', 'trees', 'O(n) time'),
  P('balanced-binary-tree', 'Balanced Binary Tree', 'E', 'trees', 'O(n) time'),
  P('same-tree', 'Same Tree', 'E', 'trees', 'O(n) time'),
  P('subtree-of-another-tree', 'Subtree of Another Tree', 'E', 'trees', 'O(m·n) time'),
  P('lowest-common-ancestor-of-a-binary-search-tree', 'Lowest Common Ancestor of a BST', 'M', 'trees', 'O(h) time'),
  P('binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', 'M', 'trees', 'O(n) BFS'),
  P('validate-binary-search-tree', 'Validate Binary Search Tree', 'M', 'trees', 'O(n) time'),
  P('kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST', 'M', 'trees', 'O(h + k) time'),

  P('kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 'E', 'heap', 'O(log k) per add'),
  P('last-stone-weight', 'Last Stone Weight', 'E', 'heap', 'O(n log n) time'),
  P('k-closest-points-to-origin', 'K Closest Points to Origin', 'M', 'heap', 'O(n log k) time'),
  P('task-scheduler', 'Task Scheduler', 'M', 'heap', 'O(n) time'),

  P('subsets', 'Subsets', 'M', 'backtrack', 'O(n·2ⁿ) time'),
  P('combination-sum', 'Combination Sum', 'M', 'backtrack', 'Prune when sum > target'),
  P('permutations', 'Permutations', 'M', 'backtrack', 'O(n·n!) time'),
  P('word-search', 'Word Search', 'M', 'backtrack', 'O(m·n·4^L) time'),

  P('number-of-islands', 'Number of Islands', 'M', 'graphs', 'O(m·n) time'),
  P('clone-graph', 'Clone Graph', 'M', 'graphs', 'O(V + E) time'),
  P('pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow', 'M', 'graphs', 'O(m·n) time'),
  P('course-schedule', 'Course Schedule', 'M', 'graphs', 'O(V + E) time'),

  P('climbing-stairs', 'Climbing Stairs', 'E', 'dp', 'O(n) time, O(1) space'),
  P('house-robber', 'House Robber', 'M', 'dp', 'O(n) time, O(1) space'),
  P('coin-change', 'Coin Change', 'M', 'dp', 'O(amount·coins) time'),
  P('longest-increasing-subsequence', 'Longest Increasing Subsequence', 'M', 'dp', 'O(n²), stretch O(n log n)'),
  P('word-break', 'Word Break', 'M', 'dp', 'O(n²) time'),
  P('longest-common-subsequence', 'Longest Common Subsequence', 'M', 'dp', 'O(m·n) time'),

  P('merge-intervals', 'Merge Intervals', 'M', 'greedy', 'O(n log n) time'),
  P('insert-interval', 'Insert Interval', 'M', 'greedy', 'O(n) time'),
  P('non-overlapping-intervals', 'Non-overlapping Intervals', 'M', 'greedy', 'O(n log n) time'),
  P('jump-game', 'Jump Game', 'M', 'greedy', 'O(n) time'),

  // Phase 2 — NeetCode 150 extras
  P('rotting-oranges', 'Rotting Oranges', 'M', 'graphs', 'O(m·n) multi-source BFS'),
  P('max-area-of-island', 'Max Area of Island', 'M', 'graphs', 'O(m·n) time'),
  P('implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)', 'M', 'tries', 'O(L) per operation'),
  P('design-add-and-search-words-data-structure', 'Design Add and Search Words', 'M', 'tries', 'O(L) add, DFS on "."'),
  P('course-schedule-ii', 'Course Schedule II', 'M', 'graphs', 'O(V + E) topo sort'),
  P('number-of-connected-components-in-an-undirected-graph', 'Number of Connected Components', 'M', 'graphs', 'O(V + E) or union-find', NC('count-connected-components')),
  P('house-robber-ii', 'House Robber II', 'M', 'dp', 'O(n) time'),
  P('decode-ways', 'Decode Ways', 'M', 'dp', 'O(n) time, O(1) space'),
  P('unique-paths', 'Unique Paths', 'M', 'dp', 'O(m·n) time, O(n) space'),
  P('longest-palindromic-substring', 'Longest Palindromic Substring', 'M', 'dp', 'O(n²) expand-around-center'),
  P('maximum-subarray', 'Maximum Subarray', 'M', 'greedy', "O(n) Kadane's"),
  P('jump-game-ii', 'Jump Game II', 'M', 'greedy', 'O(n) BFS-by-levels'),
  P('binary-tree-right-side-view', 'Binary Tree Right Side View', 'M', 'trees', 'O(n) BFS'),
  P('construct-binary-tree-from-preorder-and-inorder-traversal', 'Construct Tree from Preorder & Inorder', 'M', 'trees', 'O(n) with index map'),
  P('subsets-ii', 'Subsets II', 'M', 'backtrack', 'Sort + skip duplicates'),
  P('combination-sum-ii', 'Combination Sum II', 'M', 'backtrack', 'Sort + skip duplicates'),
  P('find-median-from-data-stream', 'Find Median from Data Stream', 'H', 'heap', 'O(log n) add, O(1) median'),
  P('meeting-rooms-ii', 'Meeting Rooms II', 'M', 'greedy', 'O(n log n) time', NC('meeting-schedule-ii')),

  // Week 8 — timed mock sets
  P('palindromic-substrings', 'Palindromic Substrings', 'M', 'dp', 'O(n²) time, O(1) space'),
  P('gas-station', 'Gas Station', 'M', 'greedy', 'O(n) time'),
  P('partition-labels', 'Partition Labels', 'M', 'greedy', 'O(n) time'),
  P('surrounded-regions', 'Surrounded Regions', 'M', 'graphs', 'O(m·n) time'),
  P('coin-change-ii', 'Coin Change II', 'M', 'dp', 'O(amount·coins) time'),
  P('network-delay-time', 'Network Delay Time', 'M', 'graphs', "O(E log V) Dijkstra"),
  P('count-good-nodes-in-binary-tree', 'Count Good Nodes in Binary Tree', 'M', 'trees', 'O(n) time'),
  P('letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number', 'M', 'backtrack', 'O(4ⁿ·n) time'),
  P('maximum-product-subarray', 'Maximum Product Subarray', 'M', 'dp', 'O(n) time, O(1) space'),
  P('partition-equal-subset-sum', 'Partition Equal Subset Sum', 'M', 'dp', 'O(n·sum) time'),
  P('redundant-connection', 'Redundant Connection', 'M', 'graphs', 'O(n·α(n)) union-find'),
  P('min-cost-to-connect-all-points', 'Min Cost to Connect All Points', 'M', 'graphs', "O(n² log n) Prim's"),
];

export const PROBLEMS = Object.fromEntries(
  LIST.map((p) => [
    p.slug,
    {
      ...p,
      url: p.url ?? `https://leetcode.com/problems/${p.slug}/`,
      video: `https://www.youtube.com/results?search_query=${encodeURIComponent('neetcode ' + p.name)}`,
    },
  ]),
);

const N = (topic, ...problems) => ({ kind: 'new', topic, problems });
const R = () => ({ kind: 'review', topic: null, problems: [] });
const M = (...problems) => ({ kind: 'mock', topic: null, problems });

// Index i = plan day i + 1. Length 56.
export const LC_DAYS = [
  N('arrays', 'encode-and-decode-strings', 'product-of-array-except-self'),
  N('twoptr', 'valid-palindrome', 'two-sum-ii-input-array-is-sorted'),
  N('twoptr', '3sum', 'container-with-most-water'),
  N('twoptr', 'trapping-rain-water'),
  N('window', 'best-time-to-buy-and-sell-stock', 'longest-substring-without-repeating-characters'),
  N('window', 'longest-repeating-character-replacement', 'permutation-in-string'),
  R(), // 7
  N('window', 'minimum-window-substring'),
  N('stack', 'valid-parentheses', 'min-stack'),
  N('stack', 'evaluate-reverse-polish-notation', 'generate-parentheses'),
  N('stack', 'daily-temperatures', 'car-fleet'),
  N('bsearch', 'binary-search', 'search-a-2d-matrix'),
  N('bsearch', 'koko-eating-bananas', 'find-minimum-in-rotated-sorted-array'),
  R(), // 14
  N('bsearch', 'search-in-rotated-sorted-array', 'time-based-key-value-store'),
  N('linked', 'reverse-linked-list', 'merge-two-sorted-lists'),
  N('linked', 'linked-list-cycle', 'reorder-list'),
  N('linked', 'remove-nth-node-from-end-of-list', 'copy-list-with-random-pointer'),
  N('linked', 'add-two-numbers', 'lru-cache'),
  N('trees', 'invert-binary-tree', 'maximum-depth-of-binary-tree'),
  R(), // 21
  N('trees', 'diameter-of-binary-tree', 'balanced-binary-tree'),
  N('trees', 'same-tree', 'subtree-of-another-tree'),
  N('trees', 'lowest-common-ancestor-of-a-binary-search-tree', 'binary-tree-level-order-traversal'),
  N('trees', 'validate-binary-search-tree', 'kth-smallest-element-in-a-bst'),
  N('heap', 'kth-largest-element-in-a-stream', 'last-stone-weight'),
  N('heap', 'k-closest-points-to-origin', 'task-scheduler'),
  R(), // 28
  N('backtrack', 'subsets', 'combination-sum'),
  N('backtrack', 'permutations', 'word-search'),
  N('graphs', 'number-of-islands', 'clone-graph'),
  N('graphs', 'pacific-atlantic-water-flow', 'course-schedule'),
  N('dp', 'climbing-stairs', 'house-robber'),
  N('dp', 'coin-change', 'longest-increasing-subsequence'),
  R(), // 35
  N('dp', 'word-break', 'longest-common-subsequence'),
  N('greedy', 'merge-intervals', 'insert-interval'),
  N('greedy', 'non-overlapping-intervals', 'jump-game'),
  N('graphs', 'rotting-oranges', 'max-area-of-island'),
  N('tries', 'implement-trie-prefix-tree', 'design-add-and-search-words-data-structure'),
  N('graphs', 'course-schedule-ii', 'number-of-connected-components-in-an-undirected-graph'),
  R(), // 42
  N('dp', 'house-robber-ii', 'decode-ways'),
  N('dp', 'unique-paths', 'longest-palindromic-substring'),
  N('greedy', 'maximum-subarray', 'jump-game-ii'),
  N('trees', 'binary-tree-right-side-view', 'construct-binary-tree-from-preorder-and-inorder-traversal'),
  N('backtrack', 'subsets-ii', 'combination-sum-ii'),
  N('heap', 'find-median-from-data-stream', 'meeting-rooms-ii'),
  R(), // 49
  M('palindromic-substrings', 'gas-station'),
  M('partition-labels', 'surrounded-regions'),
  M('coin-change-ii', 'network-delay-time'),
  M('count-good-nodes-in-binary-tree', 'letter-combinations-of-a-phone-number'),
  M('maximum-product-subarray', 'partition-equal-subset-sum'),
  M('redundant-connection', 'min-cost-to-connect-all-points'),
  R(), // 56
];

// Day 1 revisits Product of Array Except Self (only studied in July).
export const DAY_NOTES = {
  1: 'Finishes Arrays & Hashing. Product of Array Except Self is a revisit: you only studied it in July, so solve it cold this time, including the suffix pass.',
  4: 'A Hard problem. Expect it to take the full block.',
  8: 'A Hard problem. Expect it to take the full block.',
  39: 'Roadmap complete 🎉 Phase 2 adds the highest-value NeetCode 150 problems you have not done yet.',
  50: 'Mock week: set a 45-minute timer for BOTH problems, talk out loud, and no hints until the timer ends.',
};

// Status: solved = solved unaided, hinted = solved with hints, studied = studied the solution, skipped.
export const SEED_ATTEMPTS = {
  'seed:contains-duplicate': { slug: 'contains-duplicate', planDay: 0, date: '2026-07-19', status: 'solved', notes: 'Optimal hash-set, early return.' },
  'seed:valid-anagram': { slug: 'valid-anagram', planDay: 0, date: '2026-07-19', status: 'solved', notes: 'Solved via sorting. Learn the O(n) array<26> version.' },
  'seed:two-sum': { slug: 'two-sum', planDay: 0, date: '2026-07-20', status: 'solved', notes: '' },
  'seed:group-anagrams': { slug: 'group-anagrams', planDay: 0, date: '2026-07-20', status: 'solved', notes: 'First Medium! Sorted-key approach.' },
  'seed:top-k-frequent-elements': { slug: 'top-k-frequent-elements', planDay: 0, date: '2026-07-21', status: 'hinted', notes: 'Max-heap approach. Review the O(n) bucket-sort variant.' },
  'seed:product-of-array-except-self': { slug: 'product-of-array-except-self', planDay: 0, date: '2026-07-26', status: 'studied', notes: 'Guided through prefix/suffix; confirm suffix pass.' },
  'seed:longest-consecutive-sequence': { slug: 'longest-consecutive-sequence', planDay: 0, date: '2026-07-26', status: 'hinted', notes: 'Hash-set streak walk; per-streak counter bug.' },
};
