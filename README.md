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

## Code Organization and Promises
You can make your code easier to test and reason about using the following approaches.

### Keep Your Promise Chains Flat
The whole point is avoiding the pyramid of doom

**Branches**
* flatten-promises

  ```git checkout flatten-promises```

**Benifits**
  * Improves readability
  * The point of promises is to reduce the pain of they pyramid of doom

### Stateful Services (Domain Model)
Moving the server side web page code to the client doesn't mean we have to come up with all new patterns, EAA patterns and DDD patterns still apply. The only difference is that instead of a DB we are talking to a REST API. Also, everything in Angular that isn't a Service (Provider, Factory) is harder to test than a Service so put code you want to test in Services.

#### Architecture
I find using the same patterns as you would use for a server side web application works well as shown in the digram below. 

![image](https://cloud.githubusercontent.com/assets/10080111/14267374/76d53016-fa95-11e5-8e82-9003138396d2.png)

I also find that Domain Model appoarch works a little better than anemic model with domain services. This is because you will already be creating stateful services to hang your state and functionality off of and that is basically what a Entity is in a rich domain model. We find that our services end up being either VMs (View Models), Domain Services or Domain Entities depending on how they are used.

* View Model: When your service has state and logic for a single view
* Domain Entity: When your service has state and logic for more than one view
* Domain Service: When your serivce contains orchestration logic across multiple Domain Entities

We generally start with VMs and let the service evolve with our code over time.

**Branches**
* stateful-services

  ```stateful-services```

**Benifits**
  * Easier to test
  * Allows for reuse across controllers, directives, filters, etc...
  * Tried and true patterns
