# kringle

A toy programming language, specifically for solving [Advent of Code][] puzzles.

_Work in progress_

## Usage

The __kringle__ compiler is both written in JavaScript, and compiles kringle
programs to JavaScript. As such, a recent (version 8+) version of Node.js is
required. To run the compiler, first install it and its dependencies:

__npm__:

    $ npm install jimf/kringle

Then, to compile and run a kringle program:

    $ kringlec my-program.kk
    $ ./my-program.js

For a full listing of commandline options, run `kringlec` with the `--help`
flag.

## About kringle

__kringle__ is...

- **Dynamic**: After going back and forth for some time as to whether to go the
  static or dyanmic route, I settled on dynamic. My preference generally is for
  static, but with having a design goal of short programs, and the programs
  themselves generally being throw-away code, I decided the importance of the
  compiler catching errors wasn't high, and instead I'd focus efforts on having
  the runtime fail fast.
- **Compiled**: Kringle programs compile to (modern) JavaScript. As such, they
  can be run anywhere where a modern JavaScript engine is available.
- **Mostly imperative**: After having done Advent of Code for the last few
  years, my experience has been that I tend to think about many of the problems
  in an imperative way. As such, I've decided to embrace this and design the
  language such that imperative solutions come naturally.
- **Also somewhat functional**: Coming off the last point, kringle also borrows
  many ideas from functional programming languages. For example, all kringle
  functions are [curried](https://en.wikipedia.org/wiki/Currying) by default,
  and the standard library defines all functions data-last. Paired with the
  application and composition operators (`|>`, `>>` and `<<`), functions can
  be defined, passed around, and applied in useful and interesting ways.
- **Whitespace sensitive**: Kringle borrows ideas from many programming
  languages. However, stylistically, it *looks* most like [Python][] or
  [Nim][]. Blocks are defined by indentation.

## Design Goals

- **Expressive**: Most AoC problems should be solvable in 15 lines of kringle
  code or fewer (sans input/output). More code than this should be an outlier.
- **Readable**: I don't like the word "readable" in a programming context,
  because often that is just a standin for _familiar to me_. That said, I'm
  using it anyway! Kringle overloads a number of operators, and borrows a
  handful of operators from varying languages, but the intent is that most
  kringle code can be understood without requiring a deep understanding of the
  language.
- **Rich standard library**: Going hand-in-hand with the previous design goals,
  kringle offers many built-in functions for performing common tasks. Some of
  these functions have fairly abbreviated names, but again, in context, it
  should be clear what they do.
- **First class parsing**: Almost every AoC problem involves parsing data out
  of a given input string. As such, kringle should offer a wide array of tools
  for pulling data out of strings to be worked with.

## Example Program

```
# Compute average line length

# Assume input has some number of lines of data
input = '...'

total = 0
count = 0

for line in lines(input):
  total += len(line)
  count += 1

print('Average line length (A): {}' % (total / count))
```

See the [examples/](examples) directory for many more example programs. To read more
about the language, see [docs/language.md](docs/language.md).

## Motivation

While thinking about what programming language I might use to solve this year's
(2018) Advent of Code puzzles, I thought to myself: *What if there were a
programming language specifically made for Advent of Code? What might such a
language look like?* This idea floated in my head for some time, until I
finally decided I needed to get it into actual code.

## License

MIT

[Advent of Code]: https://adventofcode.com/
[npm]: https://www.npmjs.org/package/kringle
[Python]: https://www.python.org/
[Nim]: https://nim-lang.org/
