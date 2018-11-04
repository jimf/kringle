input = """
Tristram to AlphaCentauri = 34
Tristram to Snowdin = 100
Tristram to Tambi = 63
Tristram to Faerun = 108
Tristram to Norrath = 111
Tristram to Straylight = 89
Tristram to Arbre = 132
AlphaCentauri to Snowdin = 4
AlphaCentauri to Tambi = 79
AlphaCentauri to Faerun = 44
AlphaCentauri to Norrath = 147
AlphaCentauri to Straylight = 133
AlphaCentauri to Arbre = 74
Snowdin to Tambi = 105
Snowdin to Faerun = 95
Snowdin to Norrath = 48
Snowdin to Straylight = 88
Snowdin to Arbre = 7
Tambi to Faerun = 68
Tambi to Norrath = 134
Tambi to Straylight = 107
Tambi to Arbre = 40
Faerun to Norrath = 11
Faerun to Straylight = 66
Faerun to Arbre = 144
Norrath to Straylight = 115
Norrath to Arbre = 135
Straylight to Arbre = 127
"""

locations = Ø
graph = {}

for line in lines(input):
  (from, to, distance) = captures(r'(\w+) to (\w+) = (\d+)', line)
  distance = int(distance)
  locations[] = from
  locations[] = to
  graph[(from, to)] = distance
  graph[(to, from)] = distance

fn pathTotalDistance(path):
  zip(path, path[1..-1])
    |> map(fn (fromTo): graph[fromTo])
    |> sum

totalDistances = permutations(locations) |> map(pathTotalDistance)

a = min(totalDistances)
print('A: {}' % a)
assert a == 251, 'A = 251'
b = max(totalDistances)
print('B: {}' % b)
assert b == 898, 'B = 898'
