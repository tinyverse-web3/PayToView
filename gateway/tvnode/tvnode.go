package tvnode

import (
	"context"

	tvCommon "github.com/tinyverse-web3/tvbase/common"
	"github.com/tinyverse-web3/tvbase/common/config"
	"github.com/tinyverse-web3/tvbase/tvbase"
)

type Tvnode struct {
	tvbase *tvbase.TvBase
}

func NewTvNode(ctx context.Context, rootPath string, cfg *config.TvbaseConfig) (*Tvnode, error) {
	ret, err := tvbase.NewTvbase(ctx, cfg, rootPath)
	if err != nil {
		logger.Errorf("NewTvbaseService: NewTvbase error: %+v", err)
		return nil, err
	}

	return &Tvnode{
		tvbase: ret,
	}, nil
}

func (s *Tvnode) Start(ctx context.Context) error {
	err := s.tvbase.Start()
	if err != nil {
		return err
	}
	// wait rendezvous
	if s.tvbase.GetIsRendezvous() {
		return nil
	} else {
		c := s.tvbase.RegistRendezvousChan()
		select {
		case <-c:
			s.tvbase.UnregistRendezvousChan(c)
			return nil
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (m *Tvnode) GetTvbase() *tvbase.TvBase {
	return m.tvbase
}

func (m *Tvnode) GetDkvsService() tvCommon.DkvsService {
	return m.tvbase.DkvsService
}

func (m *Tvnode) GetMsgService() tvCommon.DmsgService {
	return m.tvbase.DmsgService
}
