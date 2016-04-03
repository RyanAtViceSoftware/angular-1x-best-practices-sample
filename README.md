# Angular 1.x Best Practices
Sample code from my Angular 1.x Best Practices and Lessons Learned talk. In this talk I'm covering best practices that I've used successfully with large distributed teams on large code bases for high volume sites over long periods of time.

### Running Code

1. Clone repository or download zip file and extract it.
1. Start a local server by executing ```http-server```
1. Browse to IP and port created by http-server, http://127.0.0.1:8080/ on my machine

### Running Tests

1. ```karma start```

# Session Notes
We covered the following topics in these talks.

## Debugging Tips

Learn to use chrome for development
  * Workspaces
  * Debugging using ```angular.element($0).scope()```

## Find a Good Starting Point
We like John Papa: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md

### controllerAs
      
**Branches**
* john-papa-1-controller-as-tests-failing

	```git checkout john-papa-1-controller-as-tests-failing```
* john-papa-2-controller-as-tests-passing

	```git checkout john-papa-1-controller-as-tests-passing```

**Benifits**
* Discourages scope inheritance
  * Keeps bindings explicit
  * There's always a . in your binding
  * Encourages using isolated scopes in directives
* Greatly reduces coupling to $scope in controllers
* Allows for easily nesting scopes and avoiding name collisions
          
### $inject and named functions instead of inline functions

**Branches**
* john-papa-3-inject

	```git checkout john-papa-3-inject```

**Benifits**
  * Minification safe
  * More concise and less confusing than inline inejection
  * Named functions give you a stack trace
  * Named functions spread code out a bit and make it easier to read