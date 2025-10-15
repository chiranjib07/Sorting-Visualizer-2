def sort(arr):
    a = arr.copy()
    steps = []
    n = len(a)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            steps.append({'array': a.copy(), 'highlight': [min_idx, j]})
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
        steps.append({'array': a.copy(), 'highlight': [i, min_idx]})

    pseudo = """SELECTION SORT PSEUDO:
for i in 0..n-1:
    min = i
    for j in i+1..n-1:
        highlight min and j
        if A[j] < A[min]:
            min = j
    swap(A[i], A[min])"""
    return steps, pseudo
