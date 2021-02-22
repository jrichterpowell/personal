---
title: "Things that do not work: Part 1"
date: 2021-01-22T20:35:02-05:00
---

## Prelude
In this series I'm going to detail some interesting ideas I tried in my research that didn't pan out. By doing so I hope to help other people avoid wasting time on the same things I did. Perhaps they will even realize that something here is not a waste of time and do something cool with it. 

## Definitions
One of my areas of interest is Optimal Transportation. The curious reader can no doubt find a better expose of these ideas on Wikipedia or in one of many books, but the gist is the following: we take some Polish metric space $X$, two probability measures $\mu, \nu \in \mathcal{P}(X)$, and a cost function $c : X \times X \rightarrow \mathbb{R}$. The transportation cost is then defined to be

$$W(\mu,\nu) = \inf_{\pi \in \Pi(\mu,\nu)} \int_X c(x,y) d\pi \tag{1}$$
where $\Pi(\mu,\nu)$ is the set of all couplings (measures on the product space $X \times X$ with marginals $\mu$ and $\nu$). The minimizer (which exists under reasonable conditions on $c$) of (1) is referred to as the *transport plan*. Under further conditions on $\mu,\nu$, the function $W: \mathcal{P}(X) \times \mathcal{P}(X) \rightarrow \mathbb{R}$ is a metric on $\mathcal{P}(X)$. 

If we restrict our attention to the case where $c(x,y) = |x-y|$ (the Euclidean metric) and $X = \mathbb{R}^n$, then the Kantorovich-Rubinstein duality theorem states that 

$$ \inf_{\pi \in \Pi(\mu,\nu)} \int_X c(x,y) d\pi = \max_{f \in \text{Lip}_1(X)} \int_X f d(\mu - \nu) \tag{2}$$
where $\text{Lip}_1(X)$ denotes the set of 1-Lipschitz functions on $X = \mathbb{R}^n$. This holds in more general contexts, but for our purposes this special case is sufficient.

## Analysis
While Rubinstein duality is itself a marvel, the space of Lipschitz functions is infinite dimensional, and optimization over infinite dimension spaces is a rather spicy affair. So in the interest of actually computing things, we will restrict our attention to the case where $X$ is a finite set. Indeed, in many applications such as image processing or text generation, this assumption is met. 

In such a case, the admissible functions in the right side of (2) can be viewed as finite pairs $(x_i, y_i) \in \mathbb{R}^n \times \mathbb{R}$ with the condition that 
$$ \forall i,j : |y_i - y_j | \leq |x_i - x_j| $$
(where the right side is the Euclidean metric on $\mathbb{R}^n$, and the left on $\mathbb{R}$).
If we denote the set of collections of pairs   $\{(x_i, y_i)\}\_{i=1}^N$ that satisfy this constraints as $\mathcal{A}$, then better notation for the dual is
$$\max_{f \in \text{Lip}_1(X)} \int_X f d(\mu - \nu) = \max_{\{(x_i, y_i)\} \in \mathcal{A}} \sum_{i=1}^N y_i (\mu_i - \nu_i) \tag{3} $$
The right side is a linear program in a $N$ variables and $N^2$ constraints. By constructing a graph with nodes $x_i$ and edge costs $|x_i - x_j|$, the network simplex algorithm can be used to solve this in $O(N^3)$. Cubic time, however, is prohibitive for large problems. Can we do better?

Intutively, if we wanted to maximize the right side of (2), we would want these constraints to be *saturated*. I.e, for any $i$, there should exists a $j$ such that 
$$ |y_i - y_j| = |x_i - x_j|$$
otherwise, we could increase (without loss of generality take $(\mu - \nu)(\{x_i\}) > 0$) the value of $y_i$ to improve the value of (3). Note also that we can assume that for the optimal $f = (x_i, y_i)$, $y_j = 0$ for one arbitrary $j$, since if we let $\omega = y_j$,
$$ \sum_{i=1}^N y_i (\mu_i - \nu_i)  = \sum_{i=1}^N (y_i - \omega) (\mu_i - \nu_i) $$
which is true because $ \sum_i \mu_i - \nu_i = 0$.
## Improvements?

With these observations, it's pretty easy to imagine that the following scheme might work

```
For some enumeration x_i of X
Set y_0 = 0
For i = 1,...,N
    Set max_i = max{x_j + |x_j - x_i| : 1 <= j <= i }
    Set min_i = min{x_j + |x_j - x_i| : 1 <= j <= i }
    If \mu_i - \nu_i > 0 set y_i to be the max_i
    Else set y_i to be the min_i
```
The idea here is to greedily choose the best admissible values for the $y_i$ given the Lipschitz constraints. Note also that asymptotically this scheme scales as $O(N^2)$ (due to calculating the constraints at each step).

Indeed, if we beforehand knew the optimal $f$, this scheme could construct it by choosing the ordering based on the saturating constraints. Formally, we could choose $x_0$ to be any point in $X$, then choose $x_1$ to be such that 
$$ |f(x_0) - f(x_1)| = |x_0 - x_1 |$$
and so on inductively for $x_2,x_3, ...$ It's not hard to check that given this ordering, the procedure outlined above produces the optimal function.

As the astute reader may have noticed, I did not say how to choose this ordering for enumerating $X$. Only by assuming that I already knew the optimal $f$ was I able to show that this algorithm can in fact produce it. While summoning such a maximizer out of the aether is a common magic trick employed by theoreticists, it doesn't get us very fair in the pursuit of actually computing things.

Sadly, that's exactly where this falls apart. While it's easy to show that there exists an ordering that produces the optimal potential, there does not seem to be an easy way to decide it. There seems to be a parallel to the [Greedy Colouring Algorithm](https://en.wikipedia.org/wiki/Greedy_coloring) from graph theory -- in that case there is a similar situation where there is an algorithm that outputs the answer if run with the correct ordering of the input (but for colouring determining that order is NP!). In our case however, we know the problem is polynomial, since we can simply solve the linear program for the dual problem. Of course that would be roughly as useful as the axiom of choice is to an engineer when it comes to improving upon the classical LP approach.


## Takeaways
While this particular approach does not lead to an improvement, it seems likely that some approach will. Recent innovations in regularized transport have lowered the complexity from the $O(n^3)$ linear program runtime to $O(n^2/\varepsilon)$. for an approximation. Intuitively, it seems reasonable to believe that even the unregularized problem should be of quadratic complexity.

This is because, in essence, the discrete formulation of optimal transport is a mixture of a sorting and nearest neighbours problem -- it is almost never optimal to send mass far from the source points. In one dimension it is well known that the problem is in fact equivalent to sorting. Even in higher dimensions, given the locality, it seems reasonable to believe that the work to determine the optimal plan should really only need to look at nearby points. It will likely take a further breakthrough in the theory, however, to make such improvements a reality.