ZBAR_VERSION = 0.23.90
ZBAR_SRC = zbar-$(ZBAR_VERSION)

SRC = src
BUILD = build
DIST = dist
TEST = test
TEST_TS = $(wildcard ./$(TEST)/*.test.ts)
TEST_JS = $(patsubst ./$(TEST)/%.ts,./$(BUILD)/%.js,$(TEST_TS))

EM_VERSION = 3.0.0
EM_DOCKER = docker run --rm -w /$(SRC) -v $$PWD:/$(SRC) emscripten/emsdk:$(EM_VERSION)
EMCC = $(EM_DOCKER) emcc
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_DEPS = $(ZBAR_SRC)/make.done
ZBAR_OBJS = $(ZBAR_SRC)/zbar/*.o $(ZBAR_SRC)/zbar/*/*.o
ZBAR_INC = -I $(ZBAR_SRC)/include/ -I $(ZBAR_SRC)/
EMCC_FLAGS = -Oz -Wall -Werror -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="['_malloc','_free']" \
	-s MODULARIZE=1 -s EXPORT_NAME=compiledWasm

BUNDLES = $(DIST)/index.esm.js $(DIST)/index.cjs.js $(DIST)/index.min.js

TSC = npx tsc
TSC_FLAGS = -p ./tsconfig.test.json

ROLLUP = npx rollup
ROLLUP_FLAGS = -c

.PHONY: all
all: $(BUNDLES) $(TEST_JS)

.PHONY: dist
dist: $(BUNDLES)

.PHONY: test
test: $(TEST_JS)

.PHONY: clean
clean:
	-rm $(ZBAR_SRC).tar.gz
	-rm -rf $(ZBAR_SRC) $(DIST) $(BUILD)

$(TEST_JS): $(TEST_TS) $(BUNDLES) tsconfig.json tsconfig.test.json
	$(TSC) $(TSC_FLAGS)

$(BUNDLES): $(BUILD)/zbar.wasm $(BUILD)/zbar.js $(SRC)/*.ts tsconfig.json rollup.config.js package.json
	mkdir -p $(DIST)
	$(ROLLUP) $(ROLLUP_FLAGS)
	cp $(BUILD)/zbar.wasm* $(DIST)/

$(BUILD)/zbar.wasm $(BUILD)/zbar.js: $(ZBAR_DEPS) $(SRC)/module.c $(BUILD)/symbol.test.o
	$(EMCC) $(EMCC_FLAGS) -o $(BUILD)/zbar.js $(SRC)/module.c $(ZBAR_INC) $(ZBAR_OBJS)

$(BUILD)/symbol.test.o: $(ZBAR_DEPS) $(TEST)/symbol.test.c
	mkdir -p $(BUILD)
	$(EMCC) -Wall -Werror -g2 -c $(TEST)/symbol.test.c -o $@ $(ZBAR_INC)

$(ZBAR_DEPS): $(ZBAR_SRC)/Makefile
	cd $(ZBAR_SRC) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os \
		DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"
	touch -m $(ZBAR_DEPS)

$(ZBAR_SRC)/Makefile: $(ZBAR_SRC)/configure
	cd $(ZBAR_SRC) && $(EMCONFIG) ./configure --without-x --without-xshm \
		--without-xv --without-jpeg --without-libiconv-prefix \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread --disable-assert

$(ZBAR_SRC)/configure: $(ZBAR_SRC).tar.gz
	tar zxvf $(ZBAR_SRC).tar.gz
	touch -m $(ZBAR_SRC)/configure

$(ZBAR_SRC).tar.gz:
	curl -L -o $(ZBAR_SRC).tar.gz https://linuxtv.org/downloads/zbar/zbar-$(ZBAR_VERSION).tar.gz
