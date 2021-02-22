---
title: "Map Estimation"
date: 2021-02-08T20:35:02-05:00
---


# Estimating Monge Maps

## Kantorovich 
If you look in a modern treatment of optimal transportation, you will likely find the problem defined as something like
$$ W_c(\mu,\nu) = \inf_{\pi \in \Pi(\mu,\nu)} \int_{X \times Y} c(x,y) d\pi $$
this is the modern treatment of the problem, where we model the objective as finding the minimum cost coupling between $\mu$ and $\nu$. Originally, however, the problem formulated differently. Before Kantorovich blessed us all with modern probability theory, Gaspard Monge first proposed that we intead consider
$$ \inf_{T : T_{\\# \mu} = \nu } \int_{X} |T(x) - x| d\mu$$
In the case of the Euclidean squared cost, i.e $c(x,y) = |x-y|^2$ and $\mu$ being absolutely continuous with respect to the Lebesgue measure, the celeberated Brenier theorem tells us that these two formulations yield the same results. But most of the time, this is not the case. Indeed, the ubiquitous counterexample to the equivalence of these formulations is to consider the discrete problem where $X =\\{x\\}$, $\mu = \delta_{x}$, $Y = \\{y_1,y_2\\}$ $\nu = \frac{1}{2}\delta_{y_1} + \frac{1}{2} \delta_{y_2}$

[Put a fat picture here.]

## Monge strikes back?

While Kantorovich's formulation is undeniably the "correct" one, in that it always has a solution (under very mild assumptions on $\mu$ and $\nu$), in some situations it might be interesting to consider how close we could get by still requiring a deterministic map (i.e ignoring plans). Of course, we would need a way of "softening" the constraint that $T_{\\# \mu} = \nu$, since as shown above, it might not be possible to satisfy it. Instead, we could consider

$$ \inf_{T \in L^2(X)} \left ( \int_{X} |T(x) - x|^2 d\mu  +  \Gamma (T_{\\# \mu}, \nu) \right)$$
where $\Gamma$ is some regularization term that penalizes $T_{\\# \mu}$ for differing from $\nu$.





 