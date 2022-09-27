# branch dance

theme music for your branches

## usage

install the hook

```sh
$ mv post-checkout .git/hooks/post-checkout
```

configure music per branch using spotify uris. the script reads `MUSIC` file in your repo's root.

```sh
$ echo "main=spotify:track:7E6VM4eg8ADYdgbMnXO97d" >> MUSIC
```

start switching branches

```sh
$ git checkout main
Switched to branch 'main'
▶ Komm, süsser Tod - Astrophysics
```

## requirements

- macos or linux
- git (obviously)
- [spotify-tui](https://github.com/Rigellute/spotify-tui) (set it up)
