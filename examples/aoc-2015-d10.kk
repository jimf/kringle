input = '1113122113'

fn lookAndSay(sequence):
  sequence
    |> groupby(identity)
    |> map(fn (kg): str(len(kg[1])) + kg[0])
    |> sum  # sum for strings concats all

# Preferred solution, but slow to run 40-50 twice.
# a = reduce(lookAndSay, input, 1..40)
# b = reduce(lookAndSay, input, 1..50)

a = null
b = null
looksay = input
for i in 1..50:
  looksay = lookAndSay(looksay)
  if i == 40:
    a = len(looksay)
  elif i == 50:
    b = len(looksay)

print('A: {}' % a)
assert a == 360154, 'A = 360154'
print('B: {}' % b)
assert b == 5103798, 'B = 5103798'
