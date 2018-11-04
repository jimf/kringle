# Language

## Types

```
# Integers
0
42
255
0xff

# Floats
3.14
1e3

# Booleans
true
false

# Strings
'This is a single-line string\nthat includes escape sequences'
r'This is a raw string that does not look for escape sequences'
"""
This is
a multiline
string
"""

# Null
null

# Arrays
[]
[1, 2, 3, 4, 5]

# Tuples
()
(1,)
(1, true, 'hello')

# Dictionaries
{}
{ 'apple': 'red', 'banana': 'yellow' }
{ (0, 0): 'origin', (100, 100): 'max' }

# Sets
Ø
{ 1, 2, 3 }
{ (0, 0), (0, 1) }
```

## Operators / Precedence

The following table summarizes the available operators in kringle. The table is
sorted by precedence, with the highest precedence operators appearing at the
top.

| Operator | Description |
|---|---|
| `(expressions...)`, `[expressions...]`, `{expressions...}` | Grouping, tuple/list/dictionary/set construction |
| `x[index]`, `x[index..index]`, `x(arguments...)` | Indexing, slicing, call |
| `x?` | Existence |
| `+x`, `-x`, `!x`, `~x` | Positive, negative, logical NOT, bitwise NOT |
| `^` | Exponentiation |
| `*`, `/`, `%` | Multiplication/repetition, division, remainder/string format |
| `+`, `-` | Addition/concatenation, subtraction |
| `>>>`, `<<<` | Bit shifts |
| `&` | Bitwise AND
| `|` | Bitwise OR
| `==`, `>`, `>=`, `<`, `<=`, `in`, `notin` | Comparisons, membership tests |
| `&&` | Logical AND |
| `||` | Logical OR |
| `|>` | Function application |
| `=`, `+=`, `?=`, `^=`, ... | Assignment, augmented assignments |

## Expressions

### If Expression

```
a = if x > y then 1 else -1
```

### Function expression

```
double = map(fn (x): x * 2)
```

## Statements

### If Statement

```
if x > y:
  # True branch

if x > y:
  # True branch
elif x == y:
  # One or more "else if" branches
else:
  # Optional else branch
```

### For Statement

```
for item in list:
  # Do something

for x, y in listOfTuples:
  # Do something

for x in 1, 2, 3:
  # Do something

for x in 0..9:
  # Range syntax. Iterates over 0 through 9, inclusive
```

### Function statement

```
fn double(x):
  # Functions implicitly return the value of their last expression
  x * 2

fn fib(n):
  if n == 0:
    return 0
  elif n == 1:
    return 1
  fib(n - 1) + fib(n - 2)
```

## Builtin Functions

### add(x, y)

Combines two values. For numbers, `add` returns the sum of `x` and `y`. Adding
strings and arrays results in concatenation. If `x` and `y` are tuples of
equivalent length and "shape", `add` will return a new tuple where the inner
elements of `x` and `y` have been added. Tuples of non-equivalent size and
shape will trigger an exception.

```
add(3, 5)             # => 8
add('hello', 'world') # => 'helloworld'
add([1, 2], [3, 4])   # => [1, 2, 3, 4]
add((1, 2), (3, 4))   # => (4, 6)
```

### captures(pattern, string)

Given a regex pattern string and a string to process, return an array of
substrings that match the capture groups within the pattern.

```
captures(r'(\d+)x(\d+)', '4x5') # => ['4', '5']
```

### chars(string)

Returns the given string, split into an array of individual characters.

```
chars('hello world') # => ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
```

### enumerate(list)

Maps a list to a new list of index/item pairs.

```
enumerate(['a', 'b', 'c']) # => [(0, 'a'), (1, 'b'), (2, 'c')]
```

### findall(pattern, string)

Returns all substrings within the given string that match the given pattern.

```
findall('[aeiou]', 'hello world') # => ['e', 'o', 'o']
```

### groupby(func, iterable)

Groups members of the iterable based on the given function.

```
groupby(identity, 'AABBC') # => [(2, ['A', 'A']), (2, ['B', 'B']), (1, ['C'])]
```

### identity(x)

Identity function.

```
identity(42)   # => 42
identity('hi') # => 'hi'
```

### inc(n)

Increment a given number by 1.

### indexWhere(pred, list)

Returns the first index of the list whose relative element passes the given
predicate function. Returns `null` if no index is found.

```
indexWhere(fn (s): n == 'cherry', ['apple', 'banana', 'cherry']) # => 2
```

### Inf

Constant that represents infinity.

### int(x)

Converts x to an integer.

### isDigits(string)

Returns whether the string only contains digits.

### isEven(n)

Returns whether the given number is even.

### isInteger(x)

Returns whether the given value is an integer.

### len(x)

Returns the length of the given string or collection.

### lines(string)

Returns the string, split into an array of lines.

### lt(x, y)

Returns whether y is less than x (right-associative).

```
lt(10, 42) # => false
lt(42, 10) # => true
indexWhere(lt(5), [17, 36, 4]) # => 2
```

### map(func, list)

Applies the given function to each element of the given array and returns a new
array of the results.

```
map(inc, [1, 2, 3]) # => [2, 3, 4]
```

### max(list)

Returns the largest value of the given list.

### md5(string)

Returns the md5 hash of the given string.

### min(list)

Returns the smallest value of the given list.

```
min([17, 36, 4]) # => 4
```

### print(string)

Print a message to stdout.

```
print('hello world')
print(42)
print((1, true))
print('The answer is: {}' % 42)
print('The {} {} fox' % ('quick', 'brown'))
```

### range(min, max, step)

Generate a list of numbers.

```
range(0, 5, 1) # => [0, 1, 2, 3, 4, 5]
range(0, 5, 2) # => [0, 2, 4]
```

### reduce(func, initial, list)

Reduce a list.

```
reduce(add, 0, [1, 2, 3, 4, 5]) # => 15
```

### scanl(func, initial, list)

Applies a folding function to each element in the given list, returning an
array of each reduced state.

```
scanl(add, 0, [1, 2, 3, 4, 5]) # => [1, 3, 6, 10, 15]
```

### split(delimiter, string)

Splits a string into chucks by a given delimiter.

```
split(', ', 'apple, banana, cherry') # => ['apple', 'banana', 'cherry']
```

### str(x)

Converts x to a string.

### sum(list)

Applies `add` to the entire list, reducing the list to a single value. The sum
of an empty list is always `0`.
