//Callback:
//==========================================================================================================
   /* A Callback is a function that we call inside another function. 
    A callback may or may not performed asynchronously. 
    Normally callback runs after the parent function completes its operation.

    function calculate(x)
            {
                return x+2;
            }
 
            function display(y)
            {
                //execute y
            
                return y(5);
            }
 
   console.log(display(calculate)); // Result: 7

   Here calculate() is a function. We are passing it as a callback to function display(). 
   Function display() may or may not execute it asynchronously. 
   Here callback is executed asynchronously.*/

   //================================================================================================================
  // Promise:

       /* A Promise is an object which takes a callback and executes it asynchronously. 
        A promise is considered easier to use and to maintain than callbacks.

        var promise = new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
           
            if () { 
            // everything turned out fine 
              resolve("Stuff worked!");
            }
            else {
              reject(Error("It broke"));
            }
          });
           
          promise.then(function(result) {
            console.log(result); // "Stuff worked!"
          }, function(err) {
            console.log(err); // Error: "It broke"
          });

          As we can see, then() takes two arguments, one for success, 
          one for failure (or fulfill and reject, in promises-speak).

        A promise did not remove the use of callbacks, but it made the chaining of functions straightforward and
        simplified the code, making it much easier to read*/
        //===============================callback============================================================
          function show(){
              console.log('show function calling');
          }
          function display(){
              console.log('display function call');
          }
          show();
          display();


          function show(){
            console.log('show function calling');
        }
        function display(call){
            console.log('display function calling');
            //call;
            call();//yha pr call ko fun definr krenge tab hi display fun m show fun call hoga vrna nhi
        }
        //show();
        display(show);

        function show(x){
            return (x+5);
        }
        function display(callback){
            return callback(4);
            
            
        }
        console.log(display(show));
   //=======promise=========================================================================================
   //promise ek object function hai
   
   //isko use krne k lie promise ka object bnate h phle or promise m P capital hoga always or
   //isme function define ketre h jo ki 2 parameter leta h always resolve or reject

    // resolve or reject ektarah ka method h jisko hmko call karwana hota h, koi v data print krna ho to resolve must h
  //agar koi condition true h to resolve krenge or koi error h to reject ko return krenge
        var promise = new Promise(function(resolve,reject){
                resolve('xyz');
        });
        promise.then(function(msg){
            console.log(msg);
        },
        function(err){
            console.log(err);
        }
        );

//promise.then mens condion check hoga jisme 2 fun hoga ek condtiodyion true or ek false  lie,






       
        var promise = new Promise(function(resolve,reject){
            resolve('xyz');
            //reject('error');
        });
        promise.then(function(msg){
        console.log(msg);
        },
        function(err){
        console.log(err);
        }
        );

        var data = true;
        // var data = false;
               var promise = new Promise(function(resolve,reject){ // ye ek taraj kacallback fun h
                   if(data)
                   resolve('success');
                   else
                   reject('error');
                   //reject('error');
               });
               promise.then(function(msg){ //then cond data kab jaega tab cond true hoga
               console.log(msg); //ye wala means resolve
               },
               function(err){ //ye wala means reject
               console.log(err);
               }
               );

        //promise.then ke sathtry catch wala concept use kr sakte h
        //then or catch ....

        var data = true;
        // var data = false;
               var promise = new Promise(function(resolve,reject){ // ye ek taraj kacallback fun h
                   if(data)
                   resolve('success');
                   else
                   reject('error');
                   //reject('error');
               });
               promise.then((msg)=>{
                   console.log(msg);
               }).catch((err)=>{
                console.log(err);
              }); //ye v ek tarika h

              //callback vs cb hell///////////////////////////////////////////////////////////////

              
              
/////////////////////////callback hell with promise/////////////////////////////////////////////////////////
   
          function display(){
                            
            setTimeout(function (){
              console.log('display function calling');
          },5000);
          console.log('rit  function calling');
          }

          display();  // ye asyncro h kuki ye kisi func ke complete hone ka wait nhi krta. phle display() call hua to
          //phle rit wala console print hua or jv 5000 time com hua to fr uska console print hua



          function display(callback){
            console.log('display func');
            callback();
          }
          display(function show(){
            console.log('show func')
          });//ye v callback fun hi h ..phlr display fun call hua fr show fun


          function display(callback){
            console.log('display func');
            callback();
          }
          display(function (){//yha func ka naam hta de to v same result hoga or ye anonomious func kahlaeaga
            console.log('show func')
          });

          //cmhell promise