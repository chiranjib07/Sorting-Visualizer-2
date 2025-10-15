def sort(arr):
    a = arr.copy()
    steps = []
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            steps.append({'array': a.copy(), 'highlight': [j, j+1]})
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                steps.append({'array': a.copy(), 'highlight': [j, j+1]})

    pseudo = """BUBBLE SORT PSEUDO:
for i in 0..n-1:
    for j in 0..n-i-2:
        highlight j and j+1
        if A[j] > A[j+1]:
            swap(A[j], A[j+1])"""
    return steps, pseudo
