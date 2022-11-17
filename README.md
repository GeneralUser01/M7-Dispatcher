<!-- To preview, one can in VS Code usually use the shortcut ctrl + shift + v -->
# <img src="header.jpg">
# Introductory description
Dispatcher is a web application which displays multiple methods of managing tasks, from simpler to more advanced technics in numeric order. These are displayed side-by-side with each having a table, a bar chart and a pie chart all showing live the progress made on their tasks until completion, as indicted by the status sign of any given CPU, the term representing any certain method.

View the site at [GitHub Pages](https://generaluser01.github.io/M7-Dispatcher/).

<br>

# The task processing methods
## CPU 1
This Central Processing Unit is the most straightforward one, it works its way through the queue from beginning to end focusing entirely on one task at a time in that order. With this method, the least amount of tasks will remain near the end but at that point its tasks will be the slowest to complete as well.

## CPU 2
This is the opposite of CPU 1, it works equally long on all entries in the queue. Accordingly, the most amount of tasks will remain near the end but with the most tasks being completed then too.

## CPU 3
This expands on the concept of CPU 2 by not only working on multiple tasks simultaneously, but delegating differing amounts of time depending on a task's property assigning a value between 1-5 so that the completion of some tasks can be prioritized over others while not excluding unprioritized tasks from also being worked on to some extent. Being something in between a focus on one or all tasks at a time, this method generally completes tasks in moderate amounts throughout its runtime.

<br>

# Miscellaneous features
## Changing workload/cycle
The value of the workload determines the simulation speed, thus the default is at 100. A higher value could be useful for seeing faster depletion of longer lists and a lower value for partially or entirely bringing the application to a halt.

## Adding random tasks
Likely to be considered the most convenient feature, the ability to add any number of random tasks hastily demonstrates just what this program can do.

## Copying a queue to clipboard
Being another feature which lends itself to convenience in acquiring input data, this button briefly labeled "copy" is found for each queue and copies it to clipboard in a nicely formatted manner with commas between variables and new lines between entries so that the contents can easily be pasted elsewhere.

## Sending tasks to a CPU
Each task is composed of three variables, that being a process name, task time and priority. While only CPU 3 uses the priority property, it's included in all tasks for the sake of comparison as that's the main focus of this application. As explained by a placeholder, the data is separated with either commas or spaces equally.
