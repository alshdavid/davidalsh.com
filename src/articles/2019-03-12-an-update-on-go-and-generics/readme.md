This article aims to be a brief summary of the current status of generics in Go as of the date of this piece. You will find quotes from the creators (actually only Rob Pike), syntax examples and citations.

### In this article, you’ll find

- Brief introduction
- Overview of current draft
- Opinions given by Rob Pike on the draft
- Syntax examples and cases
- Questions remaining on the draft
- An understanding of when to expect generics
- Citations

## Brief introduction

Most of us reading this article already know what generics are, and what they mean for Go. This section is more for those who are unfamiliar with generics and are keen to get up to speed on the subject.

> Sometimes what you want to do has nothing to do with the type that you’re doing it to.
>
> — Rob Pike

Generics (or parametric polymorphism) enable us to write functions which can apply algorithms to incoming parameters in a way which doesn’t force us to use the type specified in the function declaration.

Imagine this, you have a `Thing` struct and you need to sort a `Thing` slice on its key property.

```go
type Thing struct {
  key    string
  aValue string
}

func SortThings(things []Thing) []Thing {
  // Sorting algorithm
  return things
}
```

You create a `SortThings` function and that’s great. However, let's say a new struct appears, and it looks similar but is slightly different.

```go
type AnotherOne struct {
  key             string
  aDifferentValue string
}
```

Let’s say you need to sort a slice of these using the same sorting method as used in the `SortThings` function.

Currently, you would need to copy/paste the code inside `SortThings` and make a new function called `SortAnotherOne`, where everything is the same — except the input parameter type.

Enter Generics.

You can rewrite the above function where it takes the type as a parameter, alongside function parameters.

```go
func Sort(type T)(input []T) []T {
  // Sorting algorithm
  return things
}

sortedThings := Sort(Thing)(unsortedThings)
sortedAnotherOnes := Sort(AnotherOne)(unsortedAnotherOnes)
```

This allows us to reuse code in ways we couldn’t previously, or had to do (relatively) unsafe type casting after the fact.

## Overview of Current Draft

Check out the following link to see the current draft. It could change wildly before it becomes a proposal.

[Contracts — Draft Design (googlesource.com)](https://go.googlesource.com/proposal/+/master/design/go2draft-contracts.md)

An interesting part about how the Go community designs language features, in general, is that we start at the syntax. Once agreed upon, it’s left to the compiler builders to find ways to implement it.

> Why not start by saying what it is you’re trying to express, and let the compiler writers say “I have a good way to implement that”
>
> — Rob Pike

Perhaps it’s this social and inclusive approach that makes Go such an ergonomic fit for so many different problems, in any case, it implies that features take time to achieve consensus.

## The draft

The example below outlines a simple function which uses a generic type.

```go
func FuncName(type T)(parameter T) T {
  return parameter
}
```

What you see is that you declare a function which has two places for inputs. The first set of parenthesis denote input types, and the second denotes function parameters.

From here you can call the function by passing in both the type and function parameters.

```go
willBeString := FuncName(string)("Hi")
willBeString := FuncName(int)(42)
```

It’s expected that for simple cases, types may be inferred from the input, meaning you might be able to directly use the function without explicitly supplying the type.

```go
willBeString := FuncName("Hi")
willBeString := FuncName(42)
```

Now, we run into issues where functions implement a generic type, but that type doesn’t have an expected method or operator on it, however, the function calls to use it.

See the following example:

```go
func GetMin(type T)(a, b T) T {
  if a < b {
    return a
  }
  return b
}
```

This is great, however, what if the type passed in doesn’t have the `<` operator? (as would be the case with `string`)

Intuitively, it would feel that the compiler would have enough information at compile time to know if an input wouldn’t meet the requirements of the function.

Initially, Ian Lance Taylor attempted an implementation to allow the compiler to analyse functions at compile time and figure out what type satisfaction looked like in order to catch these occurrences however the implementation became too large.

> At some point he realised that it was out of control, the implementation and it was never going to come to ground and he wanted a simpler, clearer way to say “this is what I want”
>
> — Rob Pike

## Enter contracts

Contracts are a declarative way to describe what must exist on your type in order for it to be used.

The above example with a contract would look like this

```go
contract Less(t T) {
  t < t>
}

func GetMin(type T Less)(a, b T) T {
  if a < b {
    return a
  }
  return b
}
```

What we are saying with this is that any type you’re passing must be able to satisfy the requirements of the contract in order to be accepted.

In this case specifically, the type must be able to solve `<` against itself, permitting `int` but failing on `string`, `bool` or a `struct`.

> I think it would be great if we could create a version of parametric polymorphism for Go, that feels like Go when we are done.
> 
> This to me feels fairly uncontentious.
> 
> But how do you say something like the type has be convertible to int or an integer constant of any kind can go in there.
> 
> I think there is a brilliant idea waiting to be found somewhere in this slide (draft) to make this really clear and simple.
> 
> But, maybe we don’t need contracts to get started ?
> 
> — Rob Pike

## Conclusion

Parametric polymorphism (generics) are powerful, addressing a number of inconveniences in the language while also opening the door to the possibility of new types of libraries, and expressive programming styles.

At the end of the day, Go is written for us and to a large extent by us. It’s down to us as a community to talk about the features we want. Discuss our use cases and investigate the drafts.

Personally, the inclusion of modules last year had an enormously positive effect on me. Looking to the future, parametric polymorphism opens up an entirely new world of capabilities - from sorting libraries to new mechanisms of working with JSON.

## When will generics land in Go?

When expressing his feelings on an eta, Rob’s response was

The time has come to change Go, given what we have learned over the past decade of using it in production.

> It’s going to take a long time to sort this out.
> 
> It’s could be years before anything is really resolved so…
> Please be patient
> 
> — Rob Pike

References
Sydney Golang Meetup — Rob Pike — Go 2 Draft Specifications
[https://www.youtube.com/watch?v=RIvL2ONhFBI](https://www.youtube.com/watch?v=RIvL2ONhFBI)

Contracts — Draft Design
[https://go.googlesource.com/proposal/+/master/design/go2draft-contracts.md](https://go.googlesource.com/proposal/+/master/design/go2draft-contracts.md)

Proposal: Go should have generics
[https://go.googlesource.com/proposal/+/master/design/15292-generics.md](https://go.googlesource.com/proposal/+/master/design/15292-generics.md)
