Homeblocks
======

Build your homepage, block after block.

Homeblocks lets you build your own homepage with your favorite media: http links of course, but also audio streams, video streams and more.

See it in action on the cloud (OpenShift) and create your own profile there: http://www.homeblocks.net/

To install at home, you'll need nodejs, typescript, typings

I usually generate the JS files in a separate folder, which is under a different git repo (it's convenient for OpenShift). So take a look at *postbuild.sh* to see what's going on.

To build with typescript, first install dependencies with typings:

* typings install dt~express --global --save
* typings install dt~body-parser --global --save
* typings install dt~node --global --save
* typings install dt~express-serve-static-core --global --save
* typings install dt~q --global --save
* typings install dt~angular --global --save
* typings install dt~serve-static --global --save
* typings install dt~mime --global --save

... and I think that's pretty much all. Note that last time I did this, I had to manually update angular .d.ts to wipe out StaticJQuery references (or something like that).


