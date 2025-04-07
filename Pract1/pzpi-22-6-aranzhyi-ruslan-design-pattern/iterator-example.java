import java.util.Iterator;

public class LinkedList<T> {
    private LinkedListNode<T> head;
    private LinkedListNode<T> tail;

    public void add(T value) {
        tail = new LinkedListNode<>(value, tail);
        if(head == null) {
            head = tail;
        }
    }

    public T get(int pos) {
        if(pos < 0) {
            throw new IllegalArgumentException();
        }

        LinkedListIterator<T> iter = iterator();
        while(iter.hasNext()) {
            T current = iter.next();
            if(pos-- == 0) {
                return current;
            }
        }

        throw new IndexOutOfBoundsException();
    }

    public LinkedListIterator<T> iterator() {
        return new LinkedListIterator<>(head);
    }

    static class LinkedListNode<T> {
        private T value;
        private LinkedListNode<T> next;

        LinkedListNode(T value) {
            this.value = value;
        }

        LinkedListNode(T value, LinkedListNode<T> next) {
            this.value = value;
            this.next = next;
        }
    }

    public static class LinkedListIterator<T> implements Iterator<T> {
        private LinkedListNode<T> current;

        LinkedListIterator(LinkedListNode<T> head) {
            current = head;
        }

        @Override
        public boolean hasNext() {
            return current != null;
        }

        @Override
        public T next() {
            if(current == null) {
                throw new IllegalStateException();
            }
            LinkedListNode<T> ret = current;
            current = current.next;
            return ret.value;
        }
    }
}

