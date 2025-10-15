def merge_sort(a, steps):
    if len(a) > 1:
        mid = len(a) // 2
        L = a[:mid]
        R = a[mid:]

        merge_sort(L, steps)
        merge_sort(R, steps)

        i = j = k = 0
        while i < len(L) and j < len(R):
            steps.append({'array': a.copy(), 'highlight': [k]})
            if L[i] < R[j]:
                a[k] = L[i]
                i += 1
            else:
                a[k] = R[j]
                j += 1
            k += 1
            steps.append({'array': a.copy(), 'highlight': [k-1]})

        while i < len(L):
            a[k] = L[i]
            i += 1
            k += 1
            steps.append({'array': a.copy(), 'highlight': [k-1]})

        while j < len(R):
            a[k] = R[j]
            j += 1
            k += 1
            steps.append({'array': a.copy(), 'highlight': [k-1]})

def sort(arr):
    a = arr.copy()
    steps = []
    merge_sort(a, steps)

    pseudo = """MERGE SORT PSEUDO:
function mergeSort(A):
    if len(A) > 1:
        mid = len(A)//2
        L = A[:mid]
        R = A[mid:]
        mergeSort(L)
        mergeSort(R)
        merge(L,R,A)"""
    return steps, pseudo
