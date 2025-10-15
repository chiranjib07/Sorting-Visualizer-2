def quick_sort(a, low, high, steps):
    if low < high:
        pi = partition(a, low, high, steps)
        quick_sort(a, low, pi - 1, steps)
        quick_sort(a, pi + 1, high, steps)

def partition(a, low, high, steps):
    pivot = a[high]
    i = low - 1
    for j in range(low, high):
        steps.append({'array': a.copy(), 'highlight': [j, high]})
        if a[j] < pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
            steps.append({'array': a.copy(), 'highlight': [i, j]})
    a[i + 1], a[high] = a[high], a[i + 1]
    steps.append({'array': a.copy(), 'highlight': [i+1, high]})
    return i + 1

def sort(arr):
    a = arr.copy()
    steps = []
    quick_sort(a, 0, len(a) - 1, steps)

    pseudo = """QUICK SORT PSEUDO:
quickSort(A, low, high):
    if low < high:
        p = partition(A, low, high)
        quickSort(A, low, p-1)
        quickSort(A, p+1, high)

partition:
highlight pivot and current element
swap if needed"""
    return steps, pseudo
