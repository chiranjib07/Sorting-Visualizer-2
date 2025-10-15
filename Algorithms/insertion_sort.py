def sort(arr):
    a = arr.copy()
    steps = []
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            steps.append({'array': a.copy(), 'highlight': [j, j+1]})
            a[j + 1] = a[j]
            j -= 1
            steps.append({'array': a.copy(), 'highlight': [j+1]})
        a[j + 1] = key
        steps.append({'array': a.copy(), 'highlight': [j+1]})

    pseudo = """INSERTION SORT PSEUDO:
for i in 1..n-1:
    key = A[i]
    j = i-1
    while j >= 0 and A[j] > key:
        highlight j and j+1
        shift A[j] to A[j+1]
    insert key at j+1"""
    return steps, pseudo
