/**
 * @license AngularJS v1.4.0-rc.1
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$Route#example $Route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$Route', $RouteProvider),
    $RouteMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $RouteProvider
 *
 * @description
 *
 * Used for configuring Routes.
 *
 * ## Example
 * See {@link ngRoute.$Route#example $Route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var Routes = {};

  /**
   * @ngdoc method
   * @name $RouteProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the Route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    Route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$RouteParams` under the given `name`
   *        when the Route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$RouteParams` under the given `name`
   *        when the Route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, Routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} Route Mapping information to be assigned to `$Route.current` on Route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - Route parameters extracted from the current
   *        `$location.path()` by applying the current Route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - Route parameters extracted from the current
   *        `$location.path()` by applying the current Route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the Router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$Route#$RouteChangeSuccess $RouteChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$Route#$RouteChangeError $RouteChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$RouteParams` will still refer to the previous Route within these resolve
   *        functions.  Use `$Route.current.params` to access the new Route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger Route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - Route parameters extracted from the current
   *        `$location.path()` by applying the current Route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload Route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$RouteUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match Routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular Route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new Route definition to the `$Route` service.
   */
  this.when = function(path, Route) {
    //copy original Route object to preserve params inherited from proto chain
    var RouteCopy = angular.copy(Route);
    if (angular.isUndefined(RouteCopy.reloadOnSearch)) {
      RouteCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(RouteCopy.caseInsensitiveMatch)) {
      RouteCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    Routes[path] = angular.extend(
      RouteCopy,
      path && pathRegExp(path, RouteCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] == '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      Routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, RouteCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $RouteProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if Routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $RouteProvider#otherwise
   *
   * @description
   * Sets Route definition that will be used on Route change when no other Route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$Route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$RouteParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $RouteParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $Route
     * @requires $location
     * @requires $RouteParams
     *
     * @property {Object} current Reference to the current Route definition.
     * The Route definition contains:
     *
     *   - `controller`: The controller constructor as define in Route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current Route scope.
     *     - `$template` - The current Route template HTML.
     *
     * @property {Object} Routes Object with all Route configuration Objects as its properties.
     *
     * @description
     * `$Route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing Route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define Routes through {@link ngRoute.$RouteProvider $RouteProvider}'s API.
     *
     * The `$Route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$RouteParams `$RouteParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$Route` to match a Route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$Route-service" module="ngRouteExample"
     *          deps="angular-Route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$Route.current.templateUrl = {{$Route.current.templateUrl}}</pre>
     *       <pre>$Route.current.params = {{$Route.current.params}}</pre>
     *       <pre>$Route.current.scope.name = {{$Route.current.scope.name}}</pre>
     *       <pre>$RouteParams = {{$RouteParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $Route, $RouteParams, $location) {
     *          $scope.$Route = $Route;
     *          $scope.$location = $location;
     *          $scope.$RouteParams = $RouteParams;
     *      })
     *
     *      .controller('BookController', function($scope, $RouteParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $RouteParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $RouteParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $RouteParams;
     *      })
     *
     *     .config(function($RouteProvider, $locationProvider) {
     *       $RouteProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $Route#$RouteChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a Route change. At this  point the Route services starts
     * resolving all of the dependencies needed for the Route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` Route property. Once  all of the dependencies are resolved
     * `$RouteChangeSuccess` is fired.
     *
     * The Route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future Route information.
     * @param {Route} current Current Route information.
     */

    /**
     * @ngdoc event
     * @name $Route#$RouteChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a Route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current Route information.
     * @param {Route|Undefined} previous Previous Route information, or undefined if current is
     * first Route entered.
     */

    /**
     * @ngdoc event
     * @name $Route#$RouteChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current Route information.
     * @param {Route} previous Previous Route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $Route#$RouteUpdate
     * @eventType broadcast on root scope
     * @description
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current/previous Route information.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $Route = {
          Routes: Routes,

          /**
           * @ngdoc method
           * @name $Route#reload
           *
           * @description
           * Causes `$Route` service to reload the current Route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(function() {
              // Don't support cancellation of a reload for now...
              prepareRoute();
              commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $Route#updateParams
           *
           * @description
           * Causes `$Route` service to update the current URL, replacing
           * current Route parameters with those specified in `newParams`.
           * Provided property names that match the Route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$Route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$Route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $RouteMinErr('norout', 'Tried updating Route when with no current Route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $Route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param Route {Object} Route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the Route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/Router/Router.js.
     */
    function switchRouteMatcher(on, Route) {
      var keys = Route.keys,
          params = {};

      if (!Route.regexp) return null;

      var m = Route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $Route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$Route === lastRoute.$$Route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$RouteChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $Route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $RouteParams);
        $rootScope.$broadcast('$RouteUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $Route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(function() {
            if (nextRoute) {
              var locals = angular.extend({}, nextRoute.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = nextRoute.template)) {
                if (angular.isFunction(template)) {
                  template = template(nextRoute.params);
                }
              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(nextRoute.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  nextRoute.loadedTemplateUrl = templateUrl;
                  template = $templateRequest(templateUrl);
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          then(function(locals) {
            // after Route change
            if (nextRoute == $Route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $RouteParams);
              }
              $rootScope.$broadcast('$RouteChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $Route.current) {
              $rootScope.$broadcast('$RouteChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active Route, by matching it against the URL
     */
    function parseRoute() {
      // Match a Route
      var params, match;
      angular.forEach(Routes, function(Route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), Route))) {
          match = inherit(Route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$Route = Route;
        }
      });
      // No Route matched; fallback to "otherwise" Route
      return match || Routes[null] && inherit(Routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$RouteParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $RouteParams
 * @requires $Route
 *
 * @description
 * The `$RouteParams` service allows you to retrieve the current set of Route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The Route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$Route `$Route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$RouteParams` object will remain unchanged
 * (but its properties will likely change) even when a Route change occurs.
 *
 * Note that the `$RouteParams` are only updated *after* a Route change completes successfully.
 * This means that you cannot rely on `$RouteParams` being correct in Route resolve functions.
 * Instead you can use `$Route.current.params` to access the new Route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $RouteParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$Route $Route} service by
 * including the rendered template of the current Route into the main layout (`index.html`) file.
 * Every time the current Route changes, the included view changes with it according to the
 * configuration of the `$Route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-Route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$Route.current.templateUrl = {{main.$Route.current.templateUrl}}</pre>
          <pre>$Route.current.params = {{main.$Route.current.params}}</pre>
          <pre>$RouteParams = {{main.$RouteParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$RouteProvider', '$locationProvider',
            function($RouteProvider, $locationProvider) {
              $RouteProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$Route', '$RouteParams', '$location',
            function($Route, $RouteParams, $location) {
              this.$Route = $Route;
              this.$location = $location;
              this.$RouteParams = $RouteParams;
          }])
          .controller('BookCtrl', ['$RouteParams', function($RouteParams) {
            this.name = "BookCtrl";
            this.params = $RouteParams;
          }])
          .controller('ChapterCtrl', ['$RouteParams', function($RouteParams) {
            this.name = "ChapterCtrl";
            this.params = $RouteParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$Route', '$anchorScroll', '$animate'];
function ngViewFactory($Route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$RouteChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $Route.current && $Route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $Route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$Route'];
function ngViewFillContentFactory($compile, $controller, $Route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $Route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);
