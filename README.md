# ECS163Final

The following contains information on our implemented visualizations, namely their functionality and how to manage and utilize any interaction techniques. 

## Horizontal Bar Graph

This graph shows the number of mortalities in thousands for each cause in the year 2017. The bars are color coded to provide clear distinction between them. This visualization contains a mouse over interaction effect. To see the exact number of deaths for a specific cause, simply hover over the corresponding bar with the mouse and the exact number will be displayed. This interaction technique provides users with a better alternative to estimating the number based on the horizontal axis.

## Parallel Coordinates Plot

This advanced visualization shows the relationships between causes of death and age-adjusted death rate as each cause corresponds to a certain age-adjusted death rate distribution, as illustrated by the lines. This visualization contains a mouse over effect that highlights specific lines. It also contains a more significant brushing element that allows for straightforward analysis of certain subsets of data. To utilize the brush, hold down the mouse over a specific part of the axis, ideally the subset of data which you wish to focus on. Then, drag it vertically along the dashboard. Only the lines that fall within the brush will be displayed in the visualization, allowing for an enhanced focus on that specific subset of data. 

## Boxplot

This visualization is a simple boxplot representing the distribution of age among people diagnosed with heart disease. Given the simplicity of this plot and its purpose, no interaction effects were implemented.

## Scatterplot + Ground Bar Graph

This visualization contains data of heart disease mortality rates between 2006 and 2018 with race specifications. Each year in this graph has multiple bars, where each bar represents a certain race. This visualization incorporates a mouse over interaction feature, where one can hover over the bar to see the specific group it represents and the number of deaths for that group within that year. The bars are color coded as well; feel free to refer to the legend to see which color corresponds to which race/group. In addition, this plot also doubles as a scatterplot, where each point represents the combined heart disease mortality rate among all groups within that year. The mouse over feature is applied here as well. To see the exact value the point represents, simply hover the mouse over the data point. 
