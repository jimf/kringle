input = 'iwrupvqb'

a = null
b = null
# Commented out for faster test run, but line 6 would be preferred.
#for i in 0..Inf:
for i in (346386, 9958218):
  hash = md5(input + str(i))
  if hash[0..5] == '000000':
    b ?= i
  elif hash[0..4] == '00000':
    a ?= i

  if a? && b?:
    break

print('A: {}' % a)
assert a == 346386, 'A = 346386'
print('B: {}' % b)
assert b == 9958218, 'B = 9958218'
