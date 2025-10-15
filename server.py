from flask import Flask, request, jsonify
from Algorithms import bubble_sort, insertion_sort, selection_sort, merge_sort, quick_sort
app = Flask(__name__, static_folder='.', static_url_path='')
@app.route('/')
def index():
    return app.send_static_file('index.html')
@app.route('/sort', methods=['POST'])
def sort_array():
    data = request.get_json()
    if not data or 'array' not in data or 'algorithm' not in data:
        return jsonify({'error': 'Invalid request'}), 400
    arr = data['array']
    algo = data['algorithm']
    if algo == 'bubble':
        steps, pseudo = bubble_sort.sort(arr)
    elif algo == 'insertion':
        steps, pseudo = insertion_sort.sort(arr)
    elif algo == 'selection':
        steps, pseudo = selection_sort.sort(arr)
    elif algo == 'merge':
        steps, pseudo = merge_sort.sort(arr)
    elif algo == 'quick':
        steps, pseudo = quick_sort.sort(arr)
    else:
        return jsonify({'error': 'Invalid algorithm'}), 400
    return jsonify({'steps': steps, 'pseudo': pseudo})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
