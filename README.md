# branch dance

theme music for your branches

## requirements

- macos or linux
- git (obviously)
- [spotify-tui](https://github.com/Rigellute/spotify-tui) (set it up)

## setup

```sh
npx branch-dance
```

## alternatively manual install

install the hook

```sh
$ mv post-checkout .git/hooks/post-checkout
```

configure music per branch using spotify uris. the script reads `MUSIC` file in your repo's root.

```sh
$ echo "main=spotify:track:7E6VM4eg8ADYdgbMnXO97d" >> MUSIC
```

## usage

after setup start switching branches while spotify is on

```sh
$ git checkout main
Switched to branch 'main'
▶ Komm, süsser Tod - Astrophysics
```

configure branches and tracks/albums using spotify uris in `MUSIC` file in your repo's root
