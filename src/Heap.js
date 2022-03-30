export default class Heap {
    constructor() {
      this.arr = [];
    }
    Append(Node){
      var newIndex = this.arr.length;
      this.arr.push(Node);
      
      //Node.n is the index stored in the heap
      Node.n = newIndex;
      //console.log(Node.n);
      Node.P = Math.max(0, Math.floor((newIndex-1)/2) );
      let f = (newIndex-1)%2;
      
      var NodeP = this.arr[Node.P];
      
      if(f > .001){
        NodeP.R = newIndex;
      } else {
        NodeP.L = newIndex;
      }
  
      let s = Node.FCost - NodeP.FCost;
      
      while (newIndex > 0 && (s < 0 || (Math.abs(s) < .01 && Node.HCost < NodeP.HCost) )){
        //console.log(Node.FCost, NodeP.FCost);
        this.Swap(Node, NodeP);
        NodeP = this.arr[Node.P];
        //console.log(Node.FCost, NodeP.FCost);
        s = Node.FCost - NodeP.FCost;
  
      }
      
    }
  
    Remove(){
      var endNode = this.arr[this.arr.length-1];
      var currentNode = this.arr[0];
      //console.log(JSON.parse(JSON.stringify(this.arr)))
      this.Swap(currentNode, endNode);
  
      if (currentNode.P === endNode.n){
        if(currentNode.L === currentNode.n){
          currentNode.L = null;
        } else if (currentNode.R === currentNode.n){
          currentNode.R = null;
        }
      }
  
      var PIndex = Math.max(0, Math.floor((currentNode.n-1)/2) );
      var f = (currentNode.n-1)%2;
      var currentP = this.arr[PIndex];
  
      if (Math.abs(f) > .01){
        currentP.R = null;
      } else {
        currentP.L = null;
      }
      //endNode is now the node at 0
      this.arr.pop()
      
      let NodeL = endNode.L ? this.arr[endNode.L] : null; 
      let NodeR = endNode.R ? this.arr[endNode.R] : null;
      let b = NodeL && NodeR;
  
      //console.log(NodeL, NodeR)
  
      while(NodeL ?? NodeR){
        let SwapNode = null;
        let LeastNode = null;
        if(b){
          LeastNode = NodeL.FCost > NodeR.FCost ? NodeR : NodeL;
        } else {
          LeastNode = NodeL ?? NodeR;
        }
  
        SwapNode = endNode.FCost > LeastNode.FCost ? LeastNode : null; 
        if(!SwapNode){
          break;
        }
  
        this.Swap(endNode, SwapNode);
  
        //Update
        NodeL = endNode.L ? this.arr[endNode.L] : null;
        NodeR = endNode.R ? this.arr[endNode.R] : null;
        b = NodeL && NodeR;
  
      }
      //console.log(JSON.parse(JSON.stringify(this.arr)))
    }
  
    Swap(Node1, Node2){
      let Node3 = Node2.clone();
      this.arr[Node1.n] = Node2;
  
      Node2.n = Node1.n;
      Node2.P = Node1.P;
      Node2.L = Node1.L;
      Node2.R = Node1.R;
  
      this.arr[Node3.n] = Node1;
  
      Node1.n = Node3.n;
      Node1.P = Node3.P;
      Node1.L = Node3.L;
      Node1.R = Node3.R;
    }
  }
  