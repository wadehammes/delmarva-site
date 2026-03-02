SHELL := /bin/bash
.SILENT: release

release:
	if [ "$$(git branch --show-current)" != "staging" ]; then echo "release can only be run from staging branch."; exit 1; fi
	if [ -z "$(tag)"  ]; then echo "tag is required."; exit 1; fi
	if [[ "$(tag)" =~ ^v ]]; then \
		git tag $(tag); \
		git push --tags; \
	else \
		echo "Tag name must start with v (eg, v0.0.1)"; \
		exit 1; \
	fi
