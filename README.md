<!-- To preview, one can in VS Code usually use the shortcut ctrl + shift + v -->
# <img src="header.jpg">
# Introductory description
Dispatcher is a web application which displays multiple methods of managing tasks, from simpler to more advanced technics in numeric order. These are displayed side-by-side with each having a table, a bar chart and a pie chart all showing live the progress made on their tasks until completion, as indicted by the status sign of any given CPU, the term representing any certain method. 

<br>

# The task processing methods
## CPU 1
This Central Processing Unit is the most straight forward one, it works its way through the queue from beginning to end focusing entirely on one task at a time in that order.

## CPU 2
This is the polar opposite of CPU 1, it works equally long on all entries in the queue.

## CPU 3
This expands on the concept of CPU 2 by not only working on multiple tasks simultaneously, but delicating differing amounts of time depending on a task's property assigning a value between 1-5 so that the completion of some tasks can be prioritized over others while not excluding unprioritized tasks from also being worked on to some extent.

<br>

# Miscellaneous features
## Changing workload/cycle
The value of the workload determines the simulation speed, thus the default is at 100. A higher value could be useful for seeing quicker change on longer lists and a lower value for partially or entirely bringing the program to a halt.

## Adding random tasks
Likely to be considered the most convenient feature, the ability to add a plethera of random tasks hastily demonstrates just what this program can do.

## Sending tasks to a CPU
Each task is composed of three variables, that being a process name, task time and priority. While only CPU 3 uses the priority property, it's included in all tasks for the sake of comparison. 