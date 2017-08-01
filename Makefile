install: assets/vendor/marked.js assets/vendor/jquery.js assets/vendor/pure.css assets/vendor/font-awesome assets/vendor/select2
assets/vendor/marked.js:
	curl https://raw.githubusercontent.com/chjj/marked/master/lib/marked.js -o assets/vendor/marked.js

assets/vendor/jquery.js:
	cd assets/vendor && ln -s ../../node_modules/jquery/dist/jquery.js .

assets/vendor/pure.css:
	cd assets/vendor && ln -s ../../node_modules/purecss/build/pure.css .

assets/vendor/font-awesome:
	mkdir -p assets/vendor/font-awesome
	cd assets/vendor/font-awesome && ln -s ../../../node_modules/font-awesome/css .
	cd assets/vendor/font-awesome && ln -s ../../../node_modules/font-awesome/fonts .

assets/vendor/select2:
	mkdir -p assets/vendor/select2
	cd assets/vendor/select2 && ln -s ../../../node_modules/select2/dist/css .
	cd assets/vendor/select2 && ln -s ../../../node_modules/select2/dist/js .