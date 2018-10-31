# Compute average line length

# Assume input has some number of lines of data
input = '...'

total = 0
count = 0

for line in lines(input):
  total += len(line)
  count += 1

print('Average line length (A): {}' % (total / count))
